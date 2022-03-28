import React, { useCallback, useState, useEffect } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';

import AnalizeForm from '../AnalizeForm/AnalizeForm';
import SaveModal from '../SaveModal/SaveModal';

import { Button, Icon, message, Upload, Select } from 'antd';

import { IImageCropProps } from './Types';
import { IImage } from '../../Types/Common';
import { UploadFile } from 'antd/lib/upload/interface';

import 'react-image-crop/dist/ReactCrop.css';

const { Option } = Select;

const ImageCrop: React.FC<IImageCropProps> = ({
  data,
  id,
  selectedImage,
  setData,
  setSelectedImage,
  setSrc,
  setType,
  setTypeResult,
  setRepresentationType,
  representationType,
  src,
  type,
}): JSX.Element => {
  const [crop, setCrop] = useState<Crop>({});
  const [croppedImage, setCropedImage] = useState<unknown>(undefined);
  const [image, setImage] = useState<any>(null);
  const [isModalOpen, openModal] = useState<boolean>(false);
  const [isCropModalOpen, openCropModal] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (src) {
      setData(undefined);
    }
  }, [src]);

  const getCroppedImg = (image, crop) => {
    if (!image) {
      return;
    }

    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
      );
    }

    return new Promise(resolve => {
      const url = canvas.toDataURL('image/png', 1.0);
      resolve(url);
    });
  };

  const handleComplete = useCallback(async () => {
    setCropedImage(await getCroppedImg(image, crop));
  }, [crop, image]);

  const handleChange = useCallback(info => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    setFileList([info.fileList[info.fileList.length - 1]]);
    openModal(true);
  }, []);

  const handleUpload = useCallback(
    file => {
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result));
      if (file && file.type.match('image.*')) {
        reader.readAsDataURL(file);
      }
      return false;
    },
    [setSrc],
  );

  const handleCancel = useCallback(() => {
    openModal(false);
    setSrc(null);
    setFileList([]);
  }, [openModal, setFileList, setSrc]);

  return (
    <>
      <SaveModal
        id={id}
        link={src as string}
        title="Збереження"
        onCancel={handleCancel}
        openModal={openModal}
        visible={isModalOpen}
        setSelectedImage={setSelectedImage}
        setSrc={setSrc}
        setType={setType}
      />
      <Upload
        fileList={fileList}
        multiple={false}
        onChange={handleChange}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        headers={{
          authorization: 'authorization-text',
        }}
        beforeUpload={handleUpload}
        name="file"
      >
        <Button style={{ marginBottom: 30 }}>
          <Icon type="upload" />
          Завантажити
        </Button>
      </Upload>
      {src && (
        <div style={{ display: 'flex' }}>
          <div style={{ width: '80%' }}>
            <ReactCrop
              style={{ display: 'inline-block' }}
              crossorigin="anonymous"
              onImageLoaded={image => setImage(image)}
              src={src as string}
              crop={crop}
              onComplete={handleComplete}
              onChange={newCrop => setCrop(newCrop)}
            />
            <AnalizeForm
              setRepresentationType={setRepresentationType}
              representationType={representationType}
              data={data}
              image={selectedImage as IImage}
              setData={setData}
              setTypeResult={setTypeResult}
              type={type}
            />
          </div>
          <div style={{ width: '20%' }}>
            {croppedImage && (
              <div style={{ marginLeft: 50 }}>
                <img style={{ display: 'block' }} src={croppedImage as string} alt="crop" />
                <Button style={{ marginTop: 30 }} onClick={() => openCropModal(true)}>
                  Обрізати
                </Button>
                <SaveModal
                  id={id}
                  isCropped
                  link={croppedImage as string}
                  title="Збереження"
                  onCancel={() => openCropModal(false)}
                  openModal={openCropModal}
                  visible={isCropModalOpen}
                  setSelectedImage={setSelectedImage}
                  setSrc={setSrc}
                  setType={setType}
                  type={type}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCrop;
