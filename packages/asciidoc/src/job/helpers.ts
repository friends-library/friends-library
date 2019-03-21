import { Html } from '@friends-library/types';

export function makeReduceWrapper(
  before: string,
  after: string,
): (acc: string[], str: string, index: number, array: string[]) => string[] {
  return (acc = [], str, index, array) => {
    index === 0 && acc.unshift(before);
    acc.push(str);
    index === array.length - 1 && acc.push(after);
    return acc;
  };
}

export const br7 = '<br class="m7"/>';

export function ucfirst(lower: string): string {
  return lower.replace(/^\w/, c => c.toUpperCase());
}

const small = 'a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|via'.split('|');

export function capitalizeTitle(str: string): string {
  return str
    .split(' ')
    .map((word, index, parts) => {
      if (index === 0 || index === parts.length - 1) {
        return ucfirst(word);
      }
      return small.includes(word.toLowerCase()) ? word : ucfirst(word);
    })
    .join(' ');
}

export function trimTrailingPunctuation(str: string): string {
  return str.replace(/(?<!etc)[.,]$/, '');
}

export function removeMobi7Tags(html: Html): Html {
  return html
    .replace(/ *<br class="m7" *\/>\n?/gim, '')
    .replace(/ *<span class="m7">.+?<\/span>\n?/gim, '');
}
