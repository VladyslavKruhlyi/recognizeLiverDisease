import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import AnalizeChart from '../components/AnalizeChart/AnalizeChart';
import Analizes from '../components/Analizes/Analizes';
import ImageCrop from '../components/ImageCrop/ImageCrop';
import ImageSelect from '../components/ImageSelect/ImageSelect';
import PatientForm from '../components/PatientForm/PatientForm';
import TransformImages from '../components/TransformImages/TransformImages';

import { IAnalizeChartData, IImage } from '../Types/Common';
import { url } from './Types';

import { TYPICAL_IMAGES } from '../constants/TypicalImages';

const Patient: React.FC<RouteComponentProps<url>> = ({
  match: {
    params: { path },
  },
}): JSX.Element => {
  const [data, setData] = useState<IAnalizeChartData[]>();
  const [selectedImage, setSelectedImage] = useState<IImage>();
  const [src, setSrc] = useState<string | ArrayBuffer | null>('');
  const [type, setType] = useState<string>('');
  const [typeResult, setTypeResult] = useState<{ [key: string]: string }>();
  const [representationType, setRepresentationType] = useState<string>('vert');

  return (
    <>
      <PatientForm id={path} />
      <Analizes id={path} />
      <ImageCrop
        setRepresentationType={setRepresentationType}
        representationType={representationType}
        data={data}
        id={path}
        selectedImage={selectedImage}
        setData={setData}
        setSelectedImage={setSelectedImage}
        setSrc={setSrc}
        setType={setType}
        setTypeResult={setTypeResult}
        src={src}
        type={type}
      />
      {data && !!data.length && typeResult && !!Object.values(typeResult).length && (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <AnalizeChart data={data} typeResult={typeResult} />
            <div style={{ display: 'flex' }}>
              {TYPICAL_IMAGES[type][representationType].map(({ image, name }) => (
                <div style={{ margin: 10 }}>
                  <img src={image} alt={name} style={{ display: 'block', width: 220 }} />
                  <p>{name}</p>
                </div>
              ))}
            </div>
          </div>
          <TransformImages link={src as string} />
        </div>
      )}
      <ImageSelect id={path} setData={setData} setSelectedImage={setSelectedImage} setSrc={setSrc} setType={setType} />
    </>
  );
};

export default Patient;
