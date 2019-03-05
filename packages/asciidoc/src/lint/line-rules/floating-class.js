// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function rule(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line === '' || lines[lineNumber] !== '') {
    return [];
  }

  if (line[0] !== '[' || line[line.length - 1] !== ']') {
    return [];
  }

  return [{
    line: lineNumber,
    column: false,
    type: 'error',
    rule: rule.slug,
    message: 'Class/id designations (like `[.something]`) may not be followed by an empty line',
  }];
}

rule.slug = 'floating-class';
