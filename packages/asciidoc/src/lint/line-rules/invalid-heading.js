// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function (
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line[0] !== '=') {
    return [];
  }

  if (line.match(/^={2,4} [^\s\n]/)) {
    return [];
  }

  return [{
    line: lineNumber,
    column: 1,
    type: 'error',
    rule: 'invalid-heading',
    message: 'Headings may only have 2-4 equal signs, and must be followed by a space and at least one character',
  }];
}
