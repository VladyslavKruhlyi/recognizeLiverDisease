import React, { useCallback, useEffect } from 'react';

import { useRootData } from '../../hooks/useRootData';

import { IImageSelectProps } from './Types';

import { BASE_URL, STATIC, IMAGES, IMAGE } from '../../constants/API';

import './ImageSelect.scss';

const ImageSelect: React.FC<IImageSelectProps> = ({ id, setData, setSelectedImage, setSrc, setType }): JSX.Element => {
  const { images, setImages } = useRootData(({ images, setImages }) => ({
    images: images.get(),
    setImages,
  }));

  useEffect(() => {
    fetch(`${BASE_URL}${IMAGES}`, {
      headers: {
        patientId: id,
      },
    })
      .then(res => res.json())
      .then(result => setImages(result))
      .catch(err => console.error(err));
  }, [id, setImages]);

  const handleImageDelete = useCallback(
    (id: string) => {
      fetch(`${BASE_URL}${IMAGE}/${id}`, {
        method: 'DELETE',
      })
        .then(() => setImages(images.filter(({ imageId }) => imageId !== id)))
        .catch(err => console.error(err));
    },
    [images, setImages],
  );

  const handleImageSelect = useCallback(
    image => {
      setData([]);
      setSelectedImage(image);
      setSrc(`${BASE_URL}${STATIC}${image.name}`);
      setType(image.type);
    },
    [setData, setSelectedImage, setSrc, setType],
  );

  return (
    <div className="images-container">
      {images &&
        !!images.length &&
        images.map(image => {
          return (
            <div key={image.imageId} className="image">
              <div className="delete-image" onClick={() => handleImageDelete(image.imageId)}>
                x
              </div>
              <img onClick={() => handleImageSelect(image)} src={`${BASE_URL}${STATIC}${image.name}`} alt="crop" />
              <br />
              {image.name}
            </div>
          );
        })}
    </div>
  );
};

export default ImageSelect;
