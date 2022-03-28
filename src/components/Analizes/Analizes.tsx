import React, { useEffect, useState } from 'react';

import AddAnalize from './AddAnalize';

import { Button, Collapse, List } from 'antd';

import { useRootData } from '../../hooks/useRootData';

import { IAnalizesProps } from './Types';

import { ANALIZES, BASE_URL } from '../../constants/API';

const { Panel } = Collapse;

const Analizes: React.FC<IAnalizesProps> = ({ id }): JSX.Element => {
  const [isModalOpen, setModal] = useState<boolean>(false);
  const { analizes, setAnalizes } = useRootData(({ analizes, setAnalizes }) => ({
    analizes: analizes.get(),
    setAnalizes,
  }));

  useEffect(() => {
    fetch(`${BASE_URL}${ANALIZES}`, {
      headers: {
        patientId: id,
      },
    })
      .then(res => res.json())
      .then(result => {
        setAnalizes(result);
      })
      .catch(err => console.error(err));
  }, [id, setAnalizes]);

  return (
    <div>
      <Button onClick={() => setModal(true)} style={{ marginBottom: 20 }}>
        Додати аналіз
      </Button>
      <AddAnalize id={id} isModalOpen={isModalOpen} setModal={setModal} />
      <>
        {analizes && (
          <Collapse style={{ maxWidth: 400, marginBottom: 30 }}>
            <Panel header="Аналізи" key="1">
              <List
                itemLayout="horizontal"
                dataSource={analizes}
                renderItem={({ date, name, value }) => (
                  <List.Item>
                    <List.Item.Meta title={new Date(date).toLocaleDateString()} description={`${name}  ${value}`} />
                  </List.Item>
                )}
              ></List>
            </Panel>
          </Collapse>
        )}
      </>
    </div>
  );
};

export default Analizes;
