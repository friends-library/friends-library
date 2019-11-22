import React, { useState } from 'react';
import Link from 'gatsby-link';
import { CoverProps, PrintSize } from '@friends-library/types';
import { bookDims } from '@friends-library/lulu';
import { ThreeD } from '@friends-library/cover-component';
import DocActions from '../DocActions';
import SpinBook from '../images/spin-book.png';
import './DocBlock.css';

type Props = Omit<CoverProps, 'pages'> & {
  authorSlug: string;
  price: number;
  hasAudio: boolean;
  description: string;
  numChapters: number;
  altLanguageUrl?: string;
  pages: number[];
};

type Perspective = 'back' | 'front' | 'spine' | 'angle-front' | 'angle-back';

const DocBlock: React.FC<Props> = props => {
  const [perspective, setPerspective] = useState<Perspective>('angle-front');
  const { title, authorSlug, pages, author, description } = props;
  return (
    <section className="DocBlock bg-white pt-8 pb-12 px-10 md:px-12 xl:flex xl:flex-col xl:items-center">
      <div className="TopWrap md:flex">
        <div className="flex flex-col items-center order-1">
          <div className="hidden xl:block">
            <ThreeD
              {...props}
              pages={pages[0]}
              perspective={perspective}
              scaler={4 / 5}
              scope="4-5"
            />
          </div>
          <div className="xl:hidden">
            <ThreeD
              {...props}
              pages={pages[0]}
              perspective={perspective}
              scaler={3 / 5}
              scope="3-5"
            />
          </div>
          <button
            className="focus:outline-none pt-1"
            onClick={() => setPerspective(nextPerspective(perspective))}
          >
            <img src={SpinBook} alt="Spin Book" />
          </button>
        </div>
        <div className="Text mb-8 md:px-12 bg-white md:mr-6 xl:mr-10">
          <h1 className="font-sans text-3xl md:text-2-5xl font-bold leading-snug mt-8 tracking-wider mb-6">
            {title}
          </h1>
          <h2 className="font-sans text-1-5xl md:text-xl subpixel-antialiased leading-loose mb-8">
            <i className="font-serif tracking-widest pr-1">by:</i>{' '}
            <Link
              className="AuthorLink text-flprimary font-bold antialiased tracking-wider fl-underline"
              to={authorSlug}
            >
              {author}
            </Link>
          </h2>
          <p className="font-serif text-xl md:text-lg antialiased leading-relaxed">
            {description}
          </p>
          <LinksAndMeta className="hidden xl:block xl:mt-10" {...props} />
        </div>
      </div>
      <LinksAndMeta className="xl:hidden mt-6" {...props} />
    </section>
  );
};

export default DocBlock;

function LinksAndMeta(props: Props & { className: string }): JSX.Element {
  const {
    price,
    hasAudio,
    size,
    author,
    edition,
    numChapters,
    pages,
    altLanguageUrl,
    className,
  } = props;
  return (
    <div className={className}>
      <DocActions className="mb-8 lg:mx-24 xl:mx-0" price={price} hasAudio={hasAudio} />
      <div className="DocMeta flex flex-col items-center">
        <ul className="text-sans text-gray-600 leading-loose antialiased">
          <li>{author}</li>
          <li className="capitalize">{edition} Edition</li>
          <li>{dimensions(size, pages)}</li>
          <li>{numChapters} Chapters</li>
          <li>{pages.reduce((acc, p) => acc + p)} Pages</li>
          <li>112 Downloads</li>
          <li>English Language</li>
          {altLanguageUrl && (
            <li>
              <a href={altLanguageUrl}>Spanish Version</a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function dimensions(size: PrintSize, pages: number[]): string {
  return pages
    .map(p => bookDims(size, p))
    .map(dims => `${dims.width} x ${dims.height} x ${dims.depth} in`)
    .join(', ');
}

function nextPerspective(perspective: Perspective): Perspective {
  switch (perspective) {
    case 'angle-front':
      return 'spine';
    case 'spine':
      return 'angle-back';
    case 'angle-back':
      return 'back';
    default:
      return 'angle-front';
  }
}