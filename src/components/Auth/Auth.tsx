import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button, Input, Form, Modal, Tabs } from 'antd';

import { useRootData } from '../../hooks/useRootData';

import { AUTH_VARIANTS } from '../../constants/AuthVariants';
import { BASE_URL, DOCTOR } from '../../constants/API';
import { FORM_ERRORS } from '../../constants/FormErrors';

const { minError, requiredError } = FORM_ERRORS;
const { TabPane } = Tabs;

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 16,
  },
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email()
    .required(requiredError),
  password: Yup.string()
    .min(6, minError)
    .required(requiredError),
});

const Auth: React.FC = (): JSX.Element => {
  const { setDoctor } = useRootData(({ setDoctor }) => ({
    setDoctor,
  }));
  const [tab, setTab] = useState<string>('1');
  const { errors, handleSubmit, handleChange } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validateOnChange: false,
    validationSchema,
    async onSubmit({ email, password }) {
      if (tab === '2') {
        const regUser = await firebase.auth().createUserWithEmailAndPassword(email, password);
        await fetch(`${BASE_URL}${DOCTOR}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            role: 'doctor',
            firebaseUID: regUser.user?.uid,
          }),
        });
      }

      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(async () => {
          const user = await firebase.auth().signInWithEmailAndPassword(email, password);
          const doctor = await fetch(`${BASE_URL}${DOCTOR}/${user.user?.uid}`);
          const result = await doctor.text();
          setDoctor(result);
        })
        .catch(err => console.error(err));
    },
  });

  return (
    <Modal closable={false} footer={null} visible={true}>
      <Tabs defaultActiveKey="1" onChange={value => setTab(value)}>
        {AUTH_VARIANTS.map((variant, index) => (
          <TabPane tab={variant} key={(index + 1).toString()}>
            <Form {...layout} name="basic" onSubmit={handleSubmit}>
              <Form.Item label="Пошта" validateStatus={errors.email ? 'error' : ''} help={errors.email || ''}>
                <Input onChange={handleChange} id="email" />
              </Form.Item>
              <Form.Item label="Пароль" validateStatus={errors.password ? 'error' : ''} help={errors.password || ''}>
                <Input.Password onChange={handleChange} id="password" />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Ввійти  
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        ))}
      </Tabs>
    </Modal>
  );
};

export default Auth;
