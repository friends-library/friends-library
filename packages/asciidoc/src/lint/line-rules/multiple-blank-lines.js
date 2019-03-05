// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function rule(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line !== '') {
    return [];
  }

  const prevLine = lines[lineNumber - 2];
  if (typeof prevLine === 'undefined' || prevLine !== '') {
    return [];
  }

  // we only flag the LAST line of a multi-line violation
  const nextLine = lines[lineNumber];
  if (nextLine === '') {
    return [];
  }

  return [{
    line: lineNumber,
    column: false,
    type: 'error',
    rule: rule.slug,
    message: 'Multiple blank lines are not allowed',
  }];
}

rule.slug = 'multiple-blank-lines';
