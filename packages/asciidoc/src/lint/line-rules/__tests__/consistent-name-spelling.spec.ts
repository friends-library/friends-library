import consistentNameSpelling from '../consistent-name-spelling';

const opts = { lang: 'en' as const };

describe('consistentNameSpelling()', () => {
  it('creates a lint for violation of `consistent-name-spelling` rule', () => {
    const results = consistentNameSpelling('James Naylor and I', [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 11,
      fixable: true,
      type: 'error',
      rule: 'consistent-name-spelling',
      recommendation: 'James Nayler and I',
      message: 'James Nayler\'s last name should always be spelled "Nayler"',
    });
  });

  const violations: [string, string][] = [
    ['By the preaching of James Naylor', 'By the preaching of James Nayler'],
  ];

  test.each(violations)('`%s` should become "%s"', (line, reco) => {
    const results = consistentNameSpelling(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  const allowed: [string][] = [
    ['By the preaching of James Nayler'],
    ['Sir Isaac Pennington, Sr.'],
    ['Pennington Sr. was tried for treason'],
  ];

  test.each(allowed)('%s is not a lint violation', line => {
    expect(consistentNameSpelling(line, [], 1, opts)).toHaveLength(0);
  });
});