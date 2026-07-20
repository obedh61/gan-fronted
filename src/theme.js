import { createTheme } from '@mui/material/styles';

export const createAppTheme = (direction = 'ltr', mode = 'light') => {
  const isDark = mode === 'dark';

  return createTheme({
    direction,
    typography: {
      fontFamily: '"Heebo", "Roboto", "Rubik", "Assistant", sans-serif',
    },
    palette: {
      mode,
      primary: {
        main: '#2e7d32',
      },
      success: {
        main: '#2e7d32',
      },
      ...(isDark && {
        background: {
          default: '#121a14',
          paper: '#1d2a20',
        },
        text: {
          primary: '#e8f0e9',
          secondary: '#b0c4b4',
        },
        divider: 'rgba(255,255,255,0.12)',
      }),
    },
  });
};

export default createAppTheme;
