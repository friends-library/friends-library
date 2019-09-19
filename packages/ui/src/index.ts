import { en as enTheme, es as esTheme } from './theme';
export { default as Nav } from './Nav';
export { default as Tailwind } from './Tailwind';
export { default as styled } from './styled';
export { default as WhoWereTheQuakers } from './blocks/WhoWereTheQuakers';
export { default as Footer } from './Footer';
export { default as SlideoverMenu } from './SlideoverMenu';
export { default as Hero } from './blocks/Hero';
export { default as SubHero } from './blocks/SubHero';
export { default as ExploreBooks } from './blocks/ExploreBooks';
export { default as GettingStarted } from './blocks/GettingStarted';
export { default as FeaturedBooks } from './blocks/FeaturedBooks';
export { default as Formats } from './blocks/Formats';
export { t, useLocale } from './translation';
export { enTheme, esTheme };
export type Theme = typeof enTheme;

export {
  Cover,
  CoverFront,
  staticCss as coverStaticCss,
  docCss as coverDocCss,
  scalingCss as coverScalingCss,
  pdfCss as coverPdfCss,
  webCss as coverWebCss,
} from './cover';
