import React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from './theme';

function RtlProvider({ direction, mode, children }) {
  const isRtl = direction === 'rtl';

  const cache = React.useMemo(
    () =>
      createCache({
        key: isRtl ? 'muirtl' : 'mui',
        stylisPlugins: isRtl ? [prefixer, rtlPlugin] : [prefixer],
      }),
    [isRtl]
  );

  const theme = React.useMemo(() => createAppTheme(direction, mode), [direction, mode]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}

export default RtlProvider;
