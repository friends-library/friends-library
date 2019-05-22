import { getEpubManifest } from '../manifest';
import { testJob } from '../../test-helpers';

let mockCounter = 0;

jest.mock('uuid/v4', () => {
  return jest.fn(() => `uuid${++mockCounter}`);
});

describe('getEpubManifest()', () => {
  beforeEach(() => {
    mockCounter = 0;
  });

  it('returns a META-INF dir with required container.xml', async () => {
    const manifest = await getEpubManifest(testJob());

    expect(manifest['META-INF/container.xml']).toBeDefined();
  });

  it('has mimetype file in root', async () => {
    const manifest = await getEpubManifest(testJob());

    expect(manifest.mimetype).toBe('application/epub+zip');
  });

  it('removes mobi break tags', async () => {
    const manifest = await getEpubManifest(testJob());
    const html = Object.values(manifest).reduce((acc, file) => `${acc}\n${file}`, '');

    expect(html).not.toContain('<br class="m7"/>');
  });

  it('wraps dynamically created sections in full html', async () => {
    const job = testJob('== C1\n\nPara.footnote:[Foo.]');

    const manifest = await getEpubManifest(job);

    expect(manifest['OEBPS/section1.xhtml'].indexOf('<!DOCTYPE html>')).toBe(0);
    expect(manifest['OEBPS/notes.xhtml'].indexOf('<!DOCTYPE html>')).toBe(0);
  });

  it('adds sections for each chapter', async () => {
    const job = testJob('== C1\n\nP1.\n\n== C2\n\nP2.');

    const manifest = await getEpubManifest(job);

    expect(manifest['OEBPS/section1.xhtml']).not.toBeUndefined();
    expect(manifest['OEBPS/section2.xhtml']).not.toBeUndefined();
  });

  it('puts footnotes into own section', async () => {
    const job = testJob('== C1\n\nPara.footnote:[Foo.]');

    const manifest = await getEpubManifest(job);

    expect(manifest['OEBPS/notes.xhtml']).toContain('Foo.');
  });

  it('links footnotes to correct source section', async () => {
    const adoc = '== C1\n\nPara.footnote:[Foo.]\n\n== C2\n\nPara.footnote:[foo]';
    const job = testJob(adoc);

    const manifest = await getEpubManifest(job);

    expect(manifest['OEBPS/notes.xhtml']).toContain('section1.xhtml#fn-call__uuid1');
    expect(manifest['OEBPS/notes.xhtml']).toContain('section2.xhtml#fn-call__uuid2');
  });

  it('puts replaces footnote calls', async () => {
    const job = testJob('== C1\n\nPara.footnote:[Foo.]');

    const manifest = await getEpubManifest(job);

    expect(manifest['OEBPS/section1.xhtml']).toContain('Para.<sup');
    expect(manifest['OEBPS/section1.xhtml']).toContain('fn-call__uuid1');
    expect(manifest['OEBPS/section1.xhtml']).toContain('href="notes.xhtml#fn__uuid1"');
  });

  it('includes a nav file', async () => {
    const manifest = await getEpubManifest(testJob());

    expect(manifest['OEBPS/nav.xhtml']).not.toBeUndefined();
  });

  it('includes frontmatter files', async () => {
    const job = testJob('== C1\n\nPara.footnote:[Foo.]');

    const manifest = await getEpubManifest(job);

    expect(manifest['OEBPS/half-title.xhtml']).toContain('<!DOCTYPE html>');
    expect(manifest['OEBPS/copyright.xhtml']).toContain('<!DOCTYPE html>');
    expect(manifest['OEBPS/footnote-helper.xhtml']).toContain('<!DOCTYPE html>');
  });
});
