import ReactDOM from 'react-dom/client';
import './i18n';
import '@fontsource/hind-siliguri';
import AppRouter from './router';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

import './assets/styles/main.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    {/* <React.StrictMode> */}
      <AppRouter />
    {/* </React.StrictMode> */}
  </ThemeProvider>,
)
