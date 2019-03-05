// @flow
import type { Asciidoc, LintResult } from '../../../../../type';
import { quotifyLine } from '../../quotify';

export default function rule(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  const fixed = quotifyLine(line);
  if (fixed === line) {
    return [];
  }

  let column = null;
  line.split('').forEach((char, col) => {
    if (column === null && char !== fixed[col]) {
      column = col;
    }
  });

  return [{
    line: lineNumber,
    type: 'error',
    column: column || 0,
    rule: rule.slug,
    message: 'Incorrect usage of smart quotes/apostrophes',
    recommendation: fixed,
  }];
}

rule.slug = 'smart-quotes';
