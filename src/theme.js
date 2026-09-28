import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1B7F3B', dark: '#11602B', light: '#4CAF6E' },
    secondary: { main: '#FF7A00' },
    background: { default: '#F7F8F5', paper: '#FFFFFF' },
    text: { primary: '#1D2A1F', secondary: '#5C6B5F' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Nunito Sans", system-ui, sans-serif',
    h1: { fontWeight: 900, letterSpacing: '-0.02em' },
    h2: { fontWeight: 900, letterSpacing: '-0.02em' },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 800 },
    button: { textTransform: 'none', fontWeight: 800 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 999, paddingInline: 20 } } },
    MuiCard: { styleOverrides: { root: { boxShadow: '0 6px 20px rgba(20, 60, 30, 0.07)' } } },
  },
});

export default theme;
