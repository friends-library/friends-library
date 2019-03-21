import { jobFromAdoc } from './test-helpers';

function parse(adoc) {
  const {
    spec: {
      sections: [section],
    },
  } = jobFromAdoc(adoc);
  return section.heading;
}

describe('parsing headings', () => {
  const cases = [
    [
      '== Forward',
      {
        id: '_forward',
        text: 'Forward',
      },
    ],

    [
      '== Chapter 3: Foobar',
      {
        text: 'Foobar',
        sequence: {
          type: 'Chapter',
          number: 3,
        },
      },
    ],

    [
      '== Chapter x',
      {
        sequence: {
          number: 10,
        },
      },
    ],

    [
      '== Section 5: Lorem',
      {
        text: 'Lorem',
        sequence: {
          type: 'Section',
          number: 5,
        },
      },
    ],
  ];

  test.each(cases)('parses heading from %s', (adoc, heading) => {
    expect(parse(adoc)).toMatchObject(heading);
  });
});
