import { createTheme } from '@mui/material/styles';

export const createAppTheme = (direction = 'ltr') =>
  createTheme({
    direction,
    typography: {
      fontFamily: '"Heebo", "Roboto", "Rubik", "Assistant", sans-serif',
    },
    palette: {
      primary: {
        main: '#2e7d32',
      },
      success: {
        main: '#2e7d32',
      },
    },
  });

export default createAppTheme;
