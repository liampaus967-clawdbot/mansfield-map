import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Index from './index';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2D5A27',
    },
    secondary: {
      main: '#FF9800',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Index />
  </ThemeProvider>
);

export default App;
