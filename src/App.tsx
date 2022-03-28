import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';

import Auth from './components/Auth/Auth';

import { useRootData } from './hooks/useRootData';

import { IAppProps } from './Types/Common';

import { BASE_URL, PATIENTS } from './constants/API';
import { DOCKTOR_MENU } from './constants/Menus';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

const App: React.FC<IAppProps> = ({ children }): JSX.Element => {
  const { doctorId, setPatients } = useRootData(({ doctorId, setPatients }) => ({
    doctorId: doctorId.get(),
    setPatients,
  }));

  useEffect(() => {
    //TODO: impliments user remember
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetch(`${BASE_URL}${PATIENTS}`, {
        headers: {
          doctorId,
        },
      })
        .then(res => res.json())
        .then(result => setPatients(result))
        .catch(err => console.error(err));
    }
  }, [setPatients, doctorId]);

  return (
    <>
      {!!doctorId ? (
        <Content>
          <Layout style={{ background: '#fff', height: '100vh' }}>
            <Sider width={200} style={{ background: '#fff' }}>
              <Menu
                mode="inline"
                theme="dark"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%' }}
              >
                {DOCKTOR_MENU.map(
                  (item): JSX.Element => {
                    if (item.children) {
                      const { children, icon, title } = item;
                      return (
                        <SubMenu
                          key={title}
                          title={
                            <span>
                              <Icon type={icon} />
                              {title}
                            </span>
                          }
                        >
                          {children.map(({ path, title }) => (
                            <Menu.Item key={path}>
                              <Link to={path}>{title}</Link>
                            </Menu.Item>
                          ))}
                        </SubMenu>
                      );
                    } else {
                      const { icon, path, title } = item;
                      return (
                        <Menu.Item key={path}>
                          <Link to={path || '/'}>
                            <Icon type={icon} />
                            <span>{title}</span>
                          </Link>
                        </Menu.Item>
                      );
                    }
                  },
                )}
              </Menu>
            </Sider>
            <Content style={{ padding: '50px 24px', minHeight: 280 }}>{children}</Content>
          </Layout>
        </Content>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default App;
