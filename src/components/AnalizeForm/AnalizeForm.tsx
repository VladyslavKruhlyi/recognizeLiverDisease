import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { Button, Form, Select, Spin } from 'antd';

import { IAnalizeFormProps } from './Types';

import { BASE_URL, CALCULATE, IMAGE } from '../../constants/API';
import { ANALIZE_TYPES } from '../../constants/AnalizeTypes';
import { FORM_ERRORS } from '../../constants/FormErrors';

import { getTransformImages } from '../../utils/getTransformImages';
import { useRootData } from '../../hooks/useRootData';
import { REPRESENTATION_TYPES } from '../../constants/RepresentationTypes';

const { requiredError } = FORM_ERRORS;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 2,
    },
  },
};

const validationSchema = Yup.object({
  analizeType: Yup.string().required(requiredError),
});

const AnalizeForm: React.FC<IAnalizeFormProps> = ({
  data: chartData,
  image,
  setData,
  setTypeResult,
  type,
  representationType,
  setRepresentationType,
}): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const { images, setImages } = useRootData(({ images, setImages }) => ({
    images: images.get(),
    setImages,
  }));

  const { errors, handleSubmit, setFieldValue, values } = useFormik({
    initialValues: {
      analizeType: '',
    },
    validateOnChange: false,
    validationSchema,
    onSubmit(_, { resetForm }) {
      setLoading(true);
      const [transformLink, binaryLink] = getTransformImages(image.name);
      const data = {
        name: image?.name,
        task: '1',
        sensor: type,
        saveTransform: transformLink,
        saveBinarization: binaryLink,
      };
      fetch(`${BASE_URL}${CALCULATE}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then(result => {
          setLoading(false);
          const res = JSON.parse(result);
	  console.log(res.gf_result);
          setTypeResult({
            'Результат леса классификации': res.gf_result,
          });
          const data = res.mean_signs.reduce((acc, item) => {
            const column = {
              name: `${item['feature']} (${item['result']})`,
              Норма: item['value'],
              Патологія: item['threshold'],
            };
            acc.push(column);
            return acc;
          }, []);
          setData(data);
          if (image.isCropped) {
            fetch(`${BASE_URL}${IMAGE}/${image.imageId}`, {
              method: 'DELETE',
            })
              .then(() => setImages(images.filter(({ imageId }) => imageId !== image.imageId)))
              .catch(err => console.error(err));
          }
        })
        .catch(err => {
          setLoading(false);
          console.error(err);
        });
      resetForm();
    },
  });

  const { analizeType } = values;
  return (
    <>
      {isLoading ? (
        <Spin style={{ marginTop: 10 }} />
      ) : (
        <>
          {!chartData?.length && (
            <Form {...formItemLayout} onSubmit={handleSubmit}>
              <Form.Item label="Тип">
                <Select onChange={value => setRepresentationType(value)} id="sensorType" value={representationType}>
                  {REPRESENTATION_TYPES.map(({ name, type }) => (
                    <Option key={type} value={type}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Аналіз"
                validateStatus={errors.analizeType ? 'error' : ''}
                help={errors.analizeType ? errors.analizeType : ''}
              >
                <Select
                  onChange={value => setFieldValue('analizeType', value.toString())}
                  id="sensorType"
                  value={analizeType}
                >
                  {ANALIZE_TYPES.map(({ name, type }) => (
                    <Option key={type} value={type}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  Аналіз
                </Button>
              </Form.Item>
            </Form>
          )}
        </>
      )}
    </>
  );
};

export default AnalizeForm;
