import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { Button, Form, Input, Modal } from 'antd';

import { useRootData } from '../../hooks/useRootData';

import { IAddAnalizeProps } from './Types';

import { ANALIZE, BASE_URL } from '../../constants/API';
import { FORM_ERRORS } from '../../constants/FormErrors';

const { requiredError } = FORM_ERRORS;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
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
  name: Yup.string().required(requiredError),
  value: Yup.string().required(requiredError),
});

const AddAnalize: React.FC<IAddAnalizeProps> = ({ id, isModalOpen, setModal }): JSX.Element => {
  const { analizes, setAnalizes } = useRootData(({ analizes, setAnalizes }) => ({
    analizes: analizes.get(),
    setAnalizes,
  }));

  const { errors, handleChange, handleSubmit, values } = useFormik({
    initialValues: {
      name: '',
      value: '',
    },
    validateOnChange: false,
    validationSchema,
    onSubmit(values, { resetForm }) {
      const data = { ...values, patientId: id };
      fetch(`${BASE_URL}${ANALIZE}`, {
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
          if (analizes) {
            setAnalizes([result, ...analizes]);
          } else {
            setAnalizes([result]);
          }
          setModal(false);
        })
        .catch(err => console.error(err));
      resetForm();
    },
  });

  const { name, value } = values;

  return (
    <Modal onCancel={() => setModal(false)} okButtonProps={{ style: { display: 'none' } }} visible={isModalOpen}>
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="Назва" validateStatus={errors.name ? 'error' : ''} help={errors.name ? errors.name : ''}>
          <Input placeholder="Назва" onChange={handleChange} id="name" value={name} />
        </Form.Item>
        <Form.Item
          label="Значення"
          validateStatus={errors.value ? 'error' : ''}
          help={errors.value ? errors.value : ''}
        >
          <Input placeholder="Значення" onChange={handleChange} id="value" value={value} />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Зберегти
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAnalize;
