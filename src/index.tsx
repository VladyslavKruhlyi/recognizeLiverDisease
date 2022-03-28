import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import firebase from 'firebase/app';

import AddPatient from './pages/AddPatient';
import AllImages from './pages/AllImages';
import App from './App';
import DocktorsRegister from './components/DocktorsRegister/DocktorsRegister';
import Patient from './pages/Patient';
import Patients from './pages/Patients';

import { StoreProvider } from './store/context';

import './index.scss';
import 'antd/dist/antd.css';
import 'react-quill/dist/quill.snow.css';

import * as serviceWorker from './serviceWorker';

firebase.initializeApp({
  apiKey: 'AIzaSyA9NtTIkKCKn2pa7v8ZPFEbuqX_nn3X7J0',
  authDomain: 'kpi-hospital-crm.firebaseapp.com',
  databaseURL: 'https://kpi-hospital-crm.firebaseio.com',
  projectId: 'kpi-hospital-crm',
  storageBucket: 'kpi-hospital-crm.appspot.com',
  messagingSenderId: '295495699268',
  appId: '1:295495699268:web:efb5245aa66480fd296511',
});

ReactDOM.render(
  <StoreProvider>
    <BrowserRouter>
      <App>
        <Switch>
          <Route path="/admin/add-docktor" exact component={DocktorsRegister} />
          <Route path="/doctor/add-patient" exact component={AddPatient} />
          <Route path="/doctor/patient/:path" component={Patient} />
          <Route path="/doctor/patients" exact component={Patients} />
          <Route path="/doctor/images/all" exact component={AllImages} />
        </Switch>
      </App>
    </BrowserRouter>
  </StoreProvider>,
  document.getElementById('root'),
);
serviceWorker.unregister();
