import React, { useEffect, useState } from 'react';

import { IImage } from '../../Types/Common';

import './Images.scss';

const Images: React.FC = (): JSX.Element => {
  const [images, setImages] = useState<IImage[]>([]);

  useEffect(() => {
    fetch('/all/images')
      .then(res => res.json())
      .then(result => setImages(result.map(image => image)));
  }, []);

  return (
    <div className="all-images">
      {!!images.length &&
        images.map(({ name, date }) => (
          <a href={`/assets/${name}`} target="_blank">
            <img style={{ width: 150, height: 'auto' }} src={`/assets/${name}`} alt={name} />
            <p>{name}</p>
            <p>{date}</p>
          </a>
        ))}
    </div>
  );
};

export default Images;
