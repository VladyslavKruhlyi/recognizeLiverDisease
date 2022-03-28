import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Table } from 'antd';

import { useRootData } from '../../hooks/useRootData';

import { IPatient } from '../../Types/Common';

import { BASE_URL, PATIENT } from '../../constants/API';

const { Column } = Table;

const PatientsTable: React.FC = (): JSX.Element => {
  const { patients, setPatients } = useRootData(({ patients, setPatients }) => ({
    patients: patients.get(),
    setPatients,
  }));

  const history = useHistory();

  const handleDeletePatient = useCallback(
    id => {
      fetch(`${BASE_URL}${PATIENT}/${id}`, {
        method: 'DELETE',
      })
        .then(() => setPatients(patients.filter(({ patientId }) => patientId !== id)))
        .catch(err => console.error(err));
    },
    [patients, setPatients],
  );

  return (
    <Table rowKey="patientId" dataSource={patients}>
      <Column
        onCellClick={(row: IPatient) => history.push(`/doctor/patient/${row.patientId}`)}
        title="Ім'я"
        dataIndex="firstName"
        key="firstName"
      />
      <Column
        onCellClick={(row: IPatient) => history.push(`/doctor/patient/${row.patientId}`)}
        title="Прізвище"
        dataIndex="lastName"
        key="lastName"
      />
      <Column
        onCellClick={(row: IPatient) => history.push(`/doctor/patient/${row.patientId}`)}
        title="Дата"
        dataIndex="date"
        key="date"
      />
      <Column
        onCellClick={(values: IPatient) => handleDeletePatient(values.patientId)}
        title="Видалити"
        key="action"
        render={() => {
          return <a>Видалити</a>;
        }}
      />
    </Table>
  );
};

export default PatientsTable;
