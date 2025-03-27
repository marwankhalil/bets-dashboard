import TopToolbar from '../components/toolbar';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import '../styles/globals.css';
import Layout from '../components/Layout';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0072b1' }, // LinkedIn-style blue
    secondary: { main: '#ff5722' }, // sporty orange
    background: {
      default: '#eaf2f8',
      paper: '#ffffff'
    },
    text: {
      primary: '#1e1e1e',
      secondary: '#5f6368'
    }
  },
  typography: {
    fontFamily: 'Segoe UI, Roboto, sans-serif'
  }
});


export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
