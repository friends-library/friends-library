import {
  ISBN,
  Uuid,
  Asciidoc,
  Xml,
  Html,
  Css,
  Url,
  Slug,
  Name,
  Title,
  Description,
  FilePath,
  Sha,
} from './primitive';
export {
  DocPrecursor,
  ARTIFACT_TYPES,
  ArtifactType,
  PaperbackInteriorConfig,
  PaperbackCoverConfig,
  EbookConfig,
  EditionMeta,
  PageData,
  genericDpc,
} from './doc';
export { checkoutErrors, CheckoutError } from './errors';
export type Gender = 'male' | 'female';
export type Lang = 'en' | 'es';
export type EditionType = 'original' | 'modernized' | 'updated';
export type FormatType = 'pdf' | 'epub' | 'mobi' | 'audio' | 'paperback';
export type NodeEnv = 'production' | 'development';
export type PrintSize = 's' | 'm' | 'xl';
export type PrintSizeVariant = PrintSize | 'xl--condensed';
export type PrintJobStatus = 'pending' | 'accepted' | 'shipped' | 'rejected' | 'canceled';
export type AudioQuality = 'HQ' | 'LQ';

export interface PrintSizeDetails {
  abbrev: PrintSize;
  maxPages: number;
  minPages: number;
  luluName: 'Pocket Book' | 'Digest' | 'US Trade';
  dims: {
    height: number;
    width: number;
  };
  margins: {
    top: number;
    bottom: number;
    outer: number;
    inner: number;
    runningHeadTop: number;
  };
}

export interface AsciidocConversionLog {
  getText(): string;
  getSeverity(): string;
  getSourceLocation(): { getLineNumber(): number } | undefined;
}

export interface Epigraph {
  text: string;
  source?: string;
}

export type Notes = Map<string, Html>;

export interface Heading {
  id: string;
  text: string;
  shortText?: string;
  sequence?: {
    type: string;
    number: number;
  };
}

export type DocSection = Readonly<{
  id: string;
  index: number;
  heading: Heading;
  html: Html;
}>;

export interface FileManifest {
  [key: string]: string | Buffer;
}

export interface LintResult {
  line: number;
  column: number | false;
  type: 'error' | 'warning' | 'notice';
  rule: string;
  message: string;
  recommendation?: string;
  fixable?: boolean;
  info?: string;
}

export interface LintOptions {
  lang: Lang;
  editionType?: EditionType;
  include?: string[];
  exclude?: string[];
  maybe?: boolean;
}

export interface CoverProps {
  lang: Lang;
  title: string;
  isCompilation: boolean;
  author: Name;
  size: PrintSize;
  pages: number;
  edition: EditionType;
  isbn: ISBN;
  blurb: string;
  customCss: Css;
  customHtml: Html;
  fauxVolumeNum?: number;
  showGuides?: boolean;
  scope?: string;
  scaler?: number;
  allowEditingBlurb?: boolean;
  updateBlurb?: (blurb: string) => void;
}

export interface FluidBgImageObject {
  aspectRatio: number;
  src: string;
  srcSet: string;
  sizes?: string;
  base64?: string;
  tracedSVG?: string;
  srcWebp?: string;
  srcSetWebp?: string;
  media?: string;
}

export interface FluidImageObject {
  aspectRatio: number;
  src: string;
  srcSet: string;
  sizes: string;
  base64?: string;
  tracedSVG?: string;
  srcWebp?: string;
  srcSetWebp?: string;
  media?: string;
}

export function isDefined<T>(x: T | undefined): x is T {
  return typeof x !== 'undefined';
}

export function isNotFalse<T>(x: T | false): x is T {
  return x !== false;
}

export {
  ISBN,
  Uuid,
  Asciidoc,
  Xml,
  Html,
  Css,
  Url,
  Slug,
  Name,
  Title,
  Description,
  FilePath,
  Sha,
};
