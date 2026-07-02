import { render, screen, waitFor } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import heTranslations from '../public/locales/he/translation.json';
import App from './App';

// Provide a fake API base URL for components that read it at render time
beforeAll(() => {
  process.env.REACT_APP_API = 'http://localhost:8000/api';
});

i18n.use(initReactI18next).init({
  lng: 'he',
  fallbackLng: 'en',
  resources: {
    he: { translation: heTranslations },
  },
  interpolation: {
    escapeValue: false,
  },
});

test('renders app without crashing and shows navbar', async () => {
  render(
    <I18nextProvider i18n={i18n}>
      <GoogleOAuthProvider clientId="test-client-id">
        <HashRouter>
          <App />
        </HashRouter>
      </GoogleOAuthProvider>
    </I18nextProvider>
  );

  // The navbar title is rendered on every route (Hebrew default)
  await waitFor(() => {
    expect(screen.getByText(/ברוכים הבאים לגן שלנו/i)).toBeInTheDocument();
  });
});
