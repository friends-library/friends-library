// @flow
import type { Asciidoc, LintResult } from '../../../type';

export default function rule(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line === '') {
    return [];
  }

  return [{
    line: lineNumber,
    column: 1,
    type: 'error',
    rule: rule.slug,
    message: 'your message here',
  }];
}

rule.slug = 'my-slug';
