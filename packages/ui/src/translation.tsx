import React from 'react';
import { Lang } from '@friends-library/types';
import spanish from '../es-strings';
import { LANG } from './env';

let locale: Lang = 'en';

export function t(strings: TemplateStringsArray, ...vars: (string | number)[]): string {
  let string = translate(strings.join('%s'));
  return string.replace('%s', String(vars[0]));
}

export function translate(str: string): string {
  if (shouldResolveSpanish()) {
    if (spanish[str] !== undefined) {
      return spanish[str];
    }
  }
  return str;
}

export function useLocale(lang: Lang): void {
  locale = lang;
}

function shouldResolveSpanish(): boolean {
  if (typeof process !== 'undefined' && process.env && process.env.GATSBY_LANG === 'es') {
    return true;
  }

  if (locale === 'es') {
    return true;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  return document.documentElement.lang === 'es';
}

interface Props {
  className?: string;
  children: [JSX.Element, JSX.Element];
  el?: 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span';
}

type PartialProps = Omit<Props, 'el'>;

const DualComponent: React.FC<Props> = ({ el, className, children }) => {
  const Tag = el;
  const useChildren = children[LANG === 'en' ? 0 : 1];
  if (!Tag) return <React.Fragment>{useChildren}</React.Fragment>;
  return <Tag className={className}>{useChildren}</Tag>;
};

const p: React.FC<PartialProps> = props => <DualComponent el="p" {...props} />;
const span: React.FC<PartialProps> = props => <DualComponent el="span" {...props} />;
const h1: React.FC<PartialProps> = props => <DualComponent el="h1" {...props} />;
const h2: React.FC<PartialProps> = props => <DualComponent el="h2" {...props} />;
const h3: React.FC<PartialProps> = props => <DualComponent el="h3" {...props} />;
const h4: React.FC<PartialProps> = props => <DualComponent el="h4" {...props} />;
const frag: React.FC<PartialProps> = props => <DualComponent {...props} />;

export const Dual = {
  p,
  h1,
  h2,
  h3,
  h4,
  span,
  frag,
};