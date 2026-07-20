import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useColorMode } from '../ColorModeContext';

const AppToastContainer = (props) => {
  const { mode } = useColorMode();
  return <ToastContainer theme={mode} {...props} />;
};

export default AppToastContainer;
