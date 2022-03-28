import React, { useEffect } from 'react';

const DocktorsRegister: React.FC = (): JSX.Element => {
  useEffect(() => {
    console.log(window.location.pathname);
  }, []);

  return <div></div>;
};

export default DocktorsRegister;
