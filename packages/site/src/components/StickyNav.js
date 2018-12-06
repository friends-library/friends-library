// @flow
import * as React from 'react';
import { css } from '@emotion/core';
// import { t } from 'ttag';
// import { PRIMARY } from './Theme';

const element = css`
  ${'' /* background-color: ${PRIMARY}; */}
  background-color: #1e87f0;
  color: #fff;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 3;
  text-transform: uppercase;
  letter-spacing: 5px;
  height: 52px;
`;

const logo = css`
  display: inline-block;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  text-decoration: none;
  && {
    color: #fff;
  }
`;

const hamburger = css`
  user-select: none;
  cursor: pointer;
  position: absolute;
  top: 5px;
  left: 15px;
  font-size: 26px;
`;


type Props = {|
  onHamburgerClick: (any) => *,
|};

export default ({ onHamburgerClick }: Props) => (
  <div css={element}>
    <span css={hamburger} onClick={onHamburgerClick}>
      ☰
    </span>
    <a href="/" css={logo}>
      {/* {t`The Friends Library`} */}
      The Friends Library
    </a>
  </div>
);
