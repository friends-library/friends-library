import React from 'react';
import { CoverProps } from '@friends-library/types';
import { wrapClasses, docDims, threeDSpineWidth } from './css/helpers';
import Back from './Back';
import FrontInner from './FrontInner';
import Spine from './Spine';

type Props = CoverProps & {
  perspective?: 'back' | 'front' | 'spine' | 'angle-front' | 'angle-back';
};

const ThreeD: React.FC<Props> = props => {
  const { size, pages, scaler = 1 } = props;
  const { width, height } = docDims(size);
  const spineWidth = threeDSpineWidth(pages);
  const leftOffset = (width - spineWidth) / 2;
  const topOffset = (height - spineWidth) / 2;
  const perspective = props.perspective || 'angle-front';

  return (
    <div className={wrapClasses(props, ['Cover--3d', `perspective--${perspective}`])}>
      <div
        className="box"
        style={{
          ...(perspective === 'front'
            ? { transform: `translateZ(-${spineWidth * scaler}in) rotateY(0deg)` }
            : {}),
          ...(perspective === 'back'
            ? { transform: `translateZ(-${spineWidth * scaler}in) rotateY(180deg)` }
            : {}),
        }}
      >
        <Back
          {...props}
          style={{
            transform: `rotateY(180deg) translateZ(${(spineWidth * scaler) / 2}in)`,
          }}
        />
        <Spine
          {...props}
          styles={{
            width: `${spineWidth * scaler}in`,
            left: `${leftOffset * scaler}in`,
          }}
        />
        <FrontInner
          {...props}
          style={{
            transform: `rotateY(0deg) translateZ(${(spineWidth * scaler) / 2}in)`,
          }}
        />
        <div
          className="top"
          style={{
            height: `${spineWidth * scaler}in`,
            top: `${topOffset * scaler}in`,
          }}
        />
        <div
          className="right"
          style={{
            width: `${spineWidth * scaler}in`,
            left: `${leftOffset * scaler}in`,
          }}
        />
        <div
          className="bottom"
          style={{
            height: `${spineWidth * scaler}in`,
            top: `${topOffset * scaler}in`,
          }}
        />
      </div>
    </div>
  );
};

export default ThreeD;
