import React from 'react';

import { ITransformImagesProps } from './Types';

import { getTransformImages } from '../../utils/getTransformImages';

const TransformImages: React.FC<ITransformImagesProps> = ({ link }): JSX.Element => {
  const images = getTransformImages(link);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {!!images.length && (
        <>
          <div style={{ width: 150 }}>
            <img style={{ display: 'block', width: '100%' }} src={images[0]} alt="transform" />
            Бiнарiзоване зображення
          </div>
        </>
      )}
    </div>
  );
};

export default TransformImages;
