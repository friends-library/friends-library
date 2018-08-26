// @flow
import moment from 'moment';
import { memoize, pickBy } from 'lodash';
import type { Job, Html, FileManifest, Epigraph } from '../type';

export const frontmatter = memoize((job: Job): FileManifest => {
  const files = {
    'half-title': halfTitle(job),
    'original-title': originalTitle(job),
    copyright: copyright(job),
    epigraph: epigraph(job),
  };
  return pickBy(files, html => html !== '');
});

export function epigraph({ spec: { epigraphs } }: Job): Html {
  if (!epigraphs.length) {
    return '';
  }
  return `
    <div class="epigraphs own-page">
      ${epigraphs.map(renderEpigraph).join('\n<br class="m7"/>\n<br class="m7"/>\n')}
    </div>
  `;
}

function renderEpigraph({ text, source }: Epigraph, index: number): Html {
  return `
    <div class="epigraph${index > 0 ? ' epigraph--not-first' : ''}">
      <span class="epigraph__text">
        ${text}
      </span>
      ${source ? `<span class="epigraph__source">${source}</span>` : ''}
    </div>
  `;
}

export function halfTitle(job: Job): Html {
  const { spec: { meta: { title, author: { name } } } } = job;
  const header = `<h1>${title}</h1>`;
  const nameInTitle = title.indexOf(name) !== -1;
  if (nameInTitle) {
    return header;
  }
  return `${header}\n<p class="byline"><br class="m7"/>by ${name}</p>`;
}

function originalTitle({ spec: { meta } }: Job): Html {
  if (!meta.originalTitle) {
    return '';
  }

  return `
    <div class="original-title-page">
      <p class="originally-titled__label">
        Original title:
        <br class="m7"/>
        <br class="m7"/>
      </p>
      <p class="originally-titled__title">
        ${meta.originalTitle}
      </p>
    </div>
  `;
}

export function copyright(job: Job): Html {
  const { spec: { revision: { timestamp, sha, url }, meta: { published } } } = job;
  const time = moment.utc(moment.unix(timestamp)).format('MMMM Do, YYYY');
  return `
  <div class="copyright-page">
    <ul>
      <li>Public domain in the USA</li>
      ${published ? `<li>Originally published in ${published}</li>` : ''}
      <li>Ebook revision <code><a href="${url}">${sha}</a></code> — ${time}</li>
      <li>Ebook created and freely distributed by <a href="https://friendslibrary.com">The Friends Library</a></li>
      <li>Find many other free books from early Quakers at <a href="https://friendslibrary.com">friendslibrary.com</a></li>
      <li>Contact the publishers at <a href="mailto:info@friendslibrary.com.com">info@friendslibrary.com</a></li>
    </ul>
  </div>
  `;
}
