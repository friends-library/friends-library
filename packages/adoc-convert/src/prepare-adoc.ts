import { flow, memoize } from 'lodash';
import { Asciidoc } from '@friends-library/types';
import {
  backtickQuotesToEntities,
  htmlEntitiesToDecimal,
} from '@friends-library/adoc-utils';
import { br7 } from '@friends-library/doc-html';
import adocToHtml from './adoc-to-html';

export const prepareAsciidoc: (adoc: Asciidoc) => Asciidoc = memoize(
  flow([
    replaceAsterisms,
    changeChapterSynopsisMarkup,
    changeChapterSubtitleBlurbMarkup,
    prepareDiscourseParts,
    preparePostscripts,
    discreteize,
    headingsInOpenBlocks,
    swapLineEndingDashesInVerse,
    emdashBeforeBookTitle,
    enAndEmDashToDoubleDash,
    backtickQuotesToEntities,
    htmlEntitiesToDecimal,
    escapeSemicolonAfterEntity,
    signaturePrependDoubleDash,
    doubleDashToEntity,
    collapseEmDashNewlineWhitespace,
    collapseFootnoteCarets,
    replaceSmallBreaks,
    helpBookTitleTouchingFootnote,
    restoreLineEndingDashesInVerse,
    squareBracketsToEntities,
  ]),
);

function squareBracketsToEntities(adoc: Asciidoc): Asciidoc {
  return adoc.replace(/\+\+\+\[\+\+\+/gm, `&#91;`).replace(/\+\+\+\]\+\+\+/gm, `&#93;`);
}

function replaceSmallBreaks(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /\[\.small-break\]\n'''/gm,
    raw(`<div class="small-break">${br7}</div>`),
  );
}

function helpBookTitleTouchingFootnote(adoc: Asciidoc): Asciidoc {
  return adoc.replace(/#footnote:\[/g, `#{blank}footnote:[`);
}

function signaturePrependDoubleDash(adoc: Asciidoc): Asciidoc {
  return adoc.replace(/(\[\.signed-section-signature\]\n)/gm, `$1--`);
}

function collapseEmDashNewlineWhitespace(adoc: Asciidoc): Asciidoc {
  return adoc.replace(/&#8212;\n([a-z]|&#8220;|&#8216;)/gim, `&#8212;$1`);
}

function enAndEmDashToDoubleDash(adoc: Asciidoc): Asciidoc {
  return adoc.replace(/(–|—)/g, `--`);
}

function collapseFootnoteCarets(adoc: Asciidoc): Asciidoc {
  return adoc.replace(/\^\nfootnote:\[/gim, `footnote:[`);
}

function doubleDashToEntity(adoc: Asciidoc): Asciidoc {
  return adoc
    .replace(/\n--\n/gm, `{open-block-delimiter}`)
    .replace(/(?<!class="[a-z- ]+)--/gm, `&#8212;`)
    .replace(/{open-block-delimiter}/gm, `\n--\n`);
}

function escapeSemicolonAfterEntity(adoc: Asciidoc): Asciidoc {
  return adoc.replace(/(?<entity>&#\d{2,4};);/, `$<entity>+++;+++`);
}

function emdashBeforeBookTitle(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /--\[\.book-title\]#([\s|\S]+?)#/gm,
    `--+++<span class="book-title">+++$1+++</span>+++`,
  );
}
function swapLineEndingDashesInVerse(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /(?<=\n\[verse.*?\]\n____\n)([\s|\S]+?)(?=\n____)/gm,
    (_, verseLines) => verseLines.replace(/--\n/gm, `{verse-end-emdash}\n`),
  );
}

function restoreLineEndingDashesInVerse(adoc: Asciidoc): Asciidoc {
  return adoc.replace(/{verse-end-emdash}/g, `&#8212;`);
}

function preparePostscripts(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /(?<=\[\.postscript\]\n====\n\n)((P(\+\+\+\.\+\+\+|\.)? ?(S|D)|(Post(s|S)cript|Pos(d|D)ata|N(\+\+\+\.\+\+\+|\.)? ?B))(\.|:)?)/gm,
    `_$1_`,
  );
}

function prepareDiscourseParts(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /(?<=\[\.discourse-part\]\n)(Question(?:\.|:)|Pregunta(?:\.|:)|(?:Answer|Respuesta)(?: [0-9]+)?(?:\.|:)|Objection(?:\.|:)|Objeción(?:\.|:)|Inquiry [0-9]+(?:\.|:))( |\n)/gim,
    `_$1_$2`,
  );
}

function replaceAsterisms(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /\[\.asterism\]\n'''/gim,
    raw(`<div class="asterism">${br7}*&#160;&#160;*&#160;&#160;*${br7}${br7}</div>`),
  );
}

function changeChapterSynopsisMarkup(adoc: Asciidoc): Asciidoc {
  return adoc.replace(/\[\.chapter-synopsis\]\n([\s\S]+?)(?=\n\n)/gim, (_, inner) => {
    const joined = inner
      .trim()
      .split(`\n`)
      .filter((line: Asciidoc) => !line.match(/^\/\//))
      .map((line: Asciidoc) => line.trim())
      .map((line: Asciidoc) => line.replace(/^\* /, ``))
      .join(`&#8212;`);
    return `[.chapter-synopsis]\n${joined}\n\n`;
  });
}

function changeChapterSubtitleBlurbMarkup(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /\[\.chapter-subtitle--blurb\]\n([\s\S]+?)(?=\n\n)/gim,
    (_, inner) => {
      const joined = inner.trim().split(`\n`).join(` `);
      const [html] = adocToHtml(joined);
      const innerHtml = html
        .trim()
        .replace(/\n/g, ``)
        .replace(/^<div class="paragraph"><p>/, ``)
        .replace(/<\/p><\/div>$/, ``);
      return raw(`<h3 class="chapter-subtitle--blurb">${innerHtml}</h3>`);
    },
  );
}

function discreteize(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /\[((?:\.blurb|\.alt|\.centered|\.inline)+)\]\n(====?) /gm,
    `[discrete$1]\n$2 `,
  );
}

function headingsInOpenBlocks(adoc: Asciidoc): Asciidoc {
  return adoc.replace(/(\n--\n\n)([\s\S]*?)(\n\n--\n)/gim, (_, open, content, end) => {
    const inner = content.replace(
      /(^|\n\n)(?:\[([^\]]+?)\]\n)?(===+ )/gim,
      (__: any, start: string, bracket: string | undefined, heading: string) => {
        const discrete = (bracket || ``).indexOf(`discrete`) !== -1 ? `` : `discrete`;
        return `${start}[${discrete}${bracket || ``}]\n${heading}`;
      },
    );
    return `${open}${inner}${end}`;
  });
}

function raw(input: string): Asciidoc {
  return `++++\n${input}\n++++`;
}
