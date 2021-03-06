import React, { useState, useEffect } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import cx from 'classnames';
import smoothscroll from 'smoothscroll-polyfill';
import { Helmet } from 'react-helmet';
import { t } from '@friends-library/locale';
import {
  useNumCartItems,
  CartStore,
  useEscapeable,
  Dual,
  Nav,
  PopUnder,
  Footer,
} from '@friends-library/ui';
import {
  CoverWebStylesAllStatic,
  CoverWebStylesSizes,
} from '@friends-library/cover-component';
import Checkout from './Checkout';
import Slideover from './Slideover';
import { LANG } from '../env';
import ErrorBoundary from './ErrorBoundary';
import './Layout.css';

const store = CartStore.getSingleton();

const Layout: React.FC = ({ children }) => {
  const [numCartItems] = useNumCartItems();
  const [jsEnabled, setJsEnabled] = useState<boolean>(false);
  const [webp, setWebp] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [itemJustAdded, setItemJustAdded] = useState<boolean>(false);

  useEffect(() => smoothscroll.polyfill(), []);
  useEffect(() => setJsEnabled(true), []);

  // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/img/webp.js
  useEffect(() => {
    const img = new Image();
    img.onerror = () => setWebp(false);
    img.onload = (event) => {
      setWebp(event?.type === `load` ? img.width === 1 : false);
    };
    img.src = `data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=`;
  }, []);

  useEffect(() => {
    const setJustAdded: () => any = () => {
      setItemJustAdded(true);
      setTimeout(() => setItemJustAdded(false), 4000);
    };
    store.on(`toggle:visibility`, setCheckoutModalOpen);
    store.on(`cart:item-added`, setJustAdded);
    return () => {
      store.removeListener(`toggle:visibility`, setCheckoutModalOpen);
      store.removeListener(`cart:item-added`, setJustAdded);
    };
  }, []);

  useEscapeable(`.Slideover`, menuOpen, setMenuOpen);

  const data = useStaticQuery(graphql`
    query LayoutQuery {
      site {
        ...SiteMetadata
      }
      mountains: file(relativePath: { eq: "mountains.jpg" }) {
        childImageSharp {
          fluid(quality: 90, maxWidth: 1920) {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
    }
  `);

  return (
    <ErrorBoundary location="root">
      <Helmet>
        <html
          lang={LANG}
          className={cx({
            'Menu--open': menuOpen,
            'Site--blur': menuOpen || checkoutModalOpen,
          })}
        />
        <title>{t`Friends Library`}</title>
        <meta
          name="description"
          content={
            [
              `Friends Library exists to freely share the writings of early members of the Religious Society of Friends (Quakers), believing that no other collection of Christian writings more accurately communicates or powerfully illustrates the soul-transforming power of the gospel of Jesus Christ. We have ${data.site.meta.numEnglishBooks} books available for free download in multiple editions and digital formats (including PDF, MOBI, and EPUB), and a growing number of them are also recorded as audiobooks. Paperback copies are also available at very low cost.`,
              `La Biblioteca de los Amigos ha sido creada para compartir gratuitamente los escritos de los primeros miembros de la Sociedad de Amigos (Cuáqueros), ya que creemos que no existe ninguna otra colección de escritos cristianos que comunique con mayor precisión, o que ilustre con más pureza, el poder del evangelio de Jesucristo que transforma el alma. Actualmente tenemos ${data.site.meta.numSpanishBooks} libros disponibles para descargarse gratuitamente en múltiples ediciones y formatos digitales, y un número creciente de estos libros están siendo grabados como audiolibros. Libros impresos también están disponibles por un precio muy económico. `,
            ][LANG === `en` ? 0 : 1]
          }
        />
        {process.env.GATSBY_NETLIFY_CONTEXT === `preview` && (
          <meta name="robots" content="noindex, nofollow" />
        )}
        <link
          href="https://netdna.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.css"
          rel="stylesheet prefetch"
        />
        <script src="https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/dist/fetch.umd.min.js" />
        <body className={cx({ webp, 'no-webp': webp === false, 'no-js': !jsEnabled })} />
      </Helmet>
      {itemJustAdded && (
        <PopUnder
          alignRight
          style={{ position: `fixed`, right: 7, top: 73, zIndex: 1000 }}
          tailwindBgColor="flprimary"
        >
          <Dual.P className="text-white px-8 py-4 font-sans antialiased">
            <>An item was added to your cart</>
            <>Un artículo fue añadido a tu carrito</>
          </Dual.P>
        </PopUnder>
      )}
      <CoverWebStylesAllStatic />
      <CoverWebStylesSizes />
      <Slideover close={() => setMenuOpen(false)} />
      <Nav
        onHamburgerClick={() => setMenuOpen(!menuOpen)}
        onCartBadgeClick={() => store.open()}
        showCartBadge={numCartItems > 0}
      />
      <div
        style={{ paddingTop: 70 }}
        className="Content flex flex-col relative overflow-hidden bg-white min-h-screen"
      >
        {children}
        <Footer bgImg={data.mountains.childImageSharp.fluid} />
      </div>
      <Checkout isOpen={checkoutModalOpen} />
    </ErrorBoundary>
  );
};

export default Layout;
