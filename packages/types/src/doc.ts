import { Uuid, ISBN, Sha, Url } from './primitive';
import {
  Lang,
  EditionType,
  Css,
  Html,
  Asciidoc,
  Epigraph,
  DocSection,
  Notes,
  PrintSize,
  PrintSizeVariant,
} from './types';

export interface DocPrecursor {
  lang: Lang;
  friendSlug: string;
  friendInitials: string[];
  documentSlug: string;
  path: string;
  documentId: Uuid;
  editionType: EditionType;
  asciidoc: Asciidoc;
  epigraphs: Epigraph[];
  sections: DocSection[];
  paperbackSplits: number[];
  blurb: string;
  notes: Notes;
  config: { [key: string]: any };
  customCode: {
    css: { [k in ArtifactType | 'all' | 'pdf' | 'ebook']?: Css };
    html: { [k in ArtifactType | 'all' | 'pdf' | 'ebook']?: Html };
  };
  meta: {
    title: string;
    originalTitle?: string;
    published?: number;
    isbn?: ISBN;
    editor?: string;
    author: {
      name: string;
      nameSort: string;
    };
  };
  revision: {
    timestamp: number;
    sha: Sha;
    url: Url;
  };
}

export type ArtifactType =
  | 'paperback-interior'
  | 'paperback-cover'
  | 'web-pdf'
  | 'epub'
  | 'mobi';

export interface PaperbackInteriorConfig {
  printSize: PrintSize;
  frontmatter: boolean;
  condense: boolean;
  allowSplits: boolean;
}

export interface PaperbackCoverConfig {
  printSize: PrintSize;
  volumes: number[];
  showGuides?: boolean;
}

export interface EbookConfig {
  frontmatter: boolean;
  subType: 'epub' | 'mobi';
  coverImg?: Buffer;
  randomizeForLocalTesting?: boolean;
}

export interface EditionMeta {
  updated: string;
  adocLength: number;
  numSections: number;
  revision: Sha;
  productionRevision: Sha;
  paperback: {
    size: PrintSize;
    volumes: number[];
    condense: boolean;
    pageData: {
      single: { [key in PrintSizeVariant]: number };
      split?: {
        m: number[];
        xl: number[];
        'xl--condensed': number[];
      };
    };
  };
}

export type PageData = EditionMeta['paperback']['pageData'];
