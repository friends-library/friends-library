import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  PaperbackCoverConfig,
  FileManifest,
  CoverProps,
  DocPrecursor,
} from '@friends-library/types';
import { PrintPdf, css } from '@friends-library/cover-component';
import wrapBodyHtml from '../wrap-html';
import { addVolumeSuffix } from '../faux-volumes';

export default async function paperbackCover(
  dpc: DocPrecursor,
  { printSize, volumes, showGuides }: PaperbackCoverConfig,
): Promise<FileManifest[]> {
  return Promise.resolve(
    volumes.map((numPages, fauxVolIdx) => {
      return paperbackCoverFromProps({
        author: dpc.meta.author.name,
        title: addVolumeSuffix(
          dpc.meta.title,
          volumes.length > 1 ? fauxVolIdx : undefined,
        ),
        lang: dpc.lang,
        edition: dpc.editionType,
        showGuides: showGuides || false,
        customCss: dpc.customCode.css['paperback-cover'] || '',
        customHtml: dpc.customCode.html['paperback-cover'] || '',
        size: printSize,
        isbn: dpc.meta.isbn,
        pages: numPages,
        blurb: dpc.blurb,
      })[0];
    }),
  );
}

export function paperbackCoverFromProps(props: CoverProps): FileManifest[] {
  const el = React.createElement(PrintPdf, props);
  const html = ReactDOMServer.renderToStaticMarkup(el);
  return [
    {
      'doc.html': wrapBodyHtml(html, {
        isUtf8: true,
        css: ['doc.css'],
        htmlAttrs: `lang="en" class="prince pdf trim--${props.size}"`,
      }),
      'doc.css': `
        ${css.common(props).join('\n')}
        ${css.back(props).join('\n')}
        ${css.spine(props).join('\n')}
        ${css.front(props).join('\n')}
        ${css.pdf(props).join('\n')}
      `,
    },
  ];
}
