import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ColorModeContext = createContext({
  mode: 'light',
  toggleColorMode: () => {},
});

const getInitialMode = () => {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('colorMode');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    localStorage.setItem('colorMode', mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleColorMode: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [mode]
  );

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

export const useColorMode = () => useContext(ColorModeContext);

export default ColorModeContext;
