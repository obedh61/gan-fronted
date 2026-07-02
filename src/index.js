import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import StepContext from './StepContext';
import ScrollToTop from './components/ScrollToTop';
import RtlProvider from './RtlProvider';
import { useTranslation } from 'react-i18next';

function Root() {
  const { i18n } = useTranslation();
  const direction = i18n.dir(i18n.language);

  return (
    <RtlProvider direction={direction}>
      <HashRouter>
        <ScrollToTop/>
        <StepContext>
          <App />
        </StepContext>
      </HashRouter>
    </RtlProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}>
      <Root />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
