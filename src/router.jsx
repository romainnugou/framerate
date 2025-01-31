import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { useTheme } from './contexts/ThemeContext';
import Header from './components/header/Header';
import Home from './components/pages/home/Home';
import SearchResults from './components/pages/search/SearchResults';
import Game from './components/pages/games/Game';
import Footer from './components/footer/Footer';

const AppRouter = () => {
  const { mode } = useTheme();
  
  return (
    <Router>
      <Box sx={{ bgcolor: mode === 'dark' ? 'background.default' : 'background.paper', color: mode === 'dark' ? 'text.primary' : 'text.secondary', minHeight: '100vh' }}>
        <Header />
        <Box sx={{ pb: 5 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/game" element={<Game />} />
          </Routes>
          <Footer />
        </Box>
      </Box>
    </Router>
  );
};

export default AppRouter;
