import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

// Provide a fake API base URL for components that read it at render time
beforeAll(() => {
  process.env.REACT_APP_API = 'http://localhost:8000/api';
});

test('renders app without crashing and shows navbar', () => {
  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <HashRouter>
        <App />
      </HashRouter>
    </GoogleOAuthProvider>
  );

  // The navbar title is rendered on every route
  expect(screen.getByText(/welcome to our kinder/i)).toBeInTheDocument();
});
