import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
import gitConflictMarkers from './git-conflict-markers';
import characterName from '../character-name';
import { LineRule } from '../types';
import { isTableLine } from '../utils';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
  options: LintOptions,
): LintResult[] => {
  if (line === `` || isTableLine(line)) {
    return [];
  }

  if (gitConflictMarkers(line, lines, lineNumber, options).length) {
    return [];
  }

  let escapeStart: number;
  let escapeEnd: number;
  const hasEscape = line.includes(`+++`);
  if (hasEscape) {
    escapeStart = line.indexOf(`+++`) + 3;
    escapeEnd = escapeStart + line.substring(escapeStart).indexOf(`+++`);
  }

  const allowed = maps[options.lang];
  const results: LintResult[] = [];
  line.split(``).forEach((char, index) => {
    if (hasEscape && escapeStart <= index && escapeEnd > index) {
      return;
    }
    if (!allowed[char]) {
      const name = characterName(char);
      results.push(getLint(char, line, lineNumber, index + 1, name));
    }
  });

  return results;
};

function getLint(
  char: string,
  line: Asciidoc,
  lineNumber: number,
  column: number,
  name: string,
): LintResult {
  const hex = (char.codePointAt(0) || 0).toString(16);
  const unicode = `\\u${`0000`.substring(0, 4 - hex.length)}${hex}`;
  const fixableReco = fixable(name, line, column);
  return {
    line: lineNumber,
    column,
    type: `error`,
    rule: rule.slug,
    message: `Dissallowed character: \`${char}\`, code: \`${unicode}\` (${name})`,
    ...(fixableReco !== false ? { fixable: true, recommendation: fixableReco } : {}),
  };
}

function fixable(name: string, line: Asciidoc, column: number): string | false {
  switch (name) {
    case `EN DASH`:
      return line.replace(/–/g, `-`);
    case `NO-BREAK SPACE`:
      return nbsp(line, column);
    case `CYRILLIC CAPITAL LETTER O`:
      return line.replace(/О/g, `O`);
    case `BULLET`:
    case `SOFT HYPHEN`:
      return `${line.substring(0, column - 1)}${line.substring(column)}`;
    case `RIGHT SINGLE QUOTATION MARK`:
      return line.replace(/’/g, `\`'`);
    case `LEFT SINGLE QUOTATION MARK`:
      return line.replace(/‘/g, `'\``);
    case `RIGHT DOUBLE QUOTATION MARK`:
      return line.replace(/”/g, `\`"`);
    case `LEFT DOUBLE QUOTATION MARK`:
      return line.replace(/“/g, `"\``);
    default:
      return false;
  }
}

function nbsp(line: Asciidoc, column: number): Asciidoc {
  if (column === 1) {
    return line.replace(/^ +/, ``); // eslint-disable-line no-irregular-whitespace
  }
  if (line.substring(column - 11, column - 1) === `footnote:[`) {
    return line.replace(/footnote:\[./, `footnote:[`);
  }
  if (line[column] === ` ` || line[column - 2] === ` `) {
    return `${line.substring(0, column - 1)}${line.substring(column)}`;
  }
  return `${line.substring(0, column - 1)} ${line.substring(column)}`;
}

// performance sort of matters here, because we're checking every character
// of sometimes every book -- using object property lookup was about 25%
// faster than using Set.has(x), in my testing, and WAY faster than [].includes(x)
const allowedEn = [
  `abcdefghijklmnopqrstuvwxyz`,
  `ABCDEFGHIJKLMNOPQRSTUVWXYZ`,
  `01234567890`,
  `.,;:!?`,
  `"'\``,
  `£$`,
  `[]#%^&*()-_=+\\/{}°`,
  `\n `,
];

const allowedEs = allowedEn.concat([`íéóáúñü`, `ÍÉÓÁÚÑÜ`, `¡¿`]);
const maps = {
  es: toObject(allowedEs),
  en: toObject(allowedEn),
};

rule.slug = `invalid-characters`;
export default rule;

function toObject(arr: string[]): Record<string, true> {
  const lookup: Record<string, true> = {};
  return arr
    .join(``)
    .split(``)
    .reduce((obj, char) => {
      obj[char] = true;
      return obj;
    }, lookup);
}
