import { CoverCssModule } from './types';
import { css } from './helpers';
import initials from './initials';

const frontMain: CoverCssModule = (props, scaler, scope) => {
  const [initialsCss, initialsDynamicCss] = initials(props, scaler, scope);
  const staticCss = css`
    .front__main {
      position: relative;
    }

    .front__main .title-wrap,
    .front__main .initials {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-direction: column;
    }

    .front__main .title-wrap {
      justify-content: center;
      text-align: center;
    }

    .front__main .title-wrap .title {
      margin-right: -6%;
      margin-left: -6%;
      width: 150%;
      line-height: 200%;
      font-size: 18%;
      transform: translateX(-12.5%) scale(0.46);
      transform-origin: center center;
      letter-spacing: 0.0335em;
    }

    ${initialsCss}
  `;

  const dynamicCss = css`
    .trim--s .front__main {
      height: 4in;
    }

    .trim--m .front__main {
      height: 4.825in;
    }

    .trim--xl .front__main {
      height: 4.7in;
    }

    ${initialsDynamicCss}
  `;

  return [staticCss, dynamicCss];
};

export default frontMain;
