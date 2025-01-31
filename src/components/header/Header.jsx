import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Container, Box, Link, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import TranslateIcon from '@mui/icons-material/Translate';
import SearchBar from './SearchBar';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { mode, toggleTheme } = useTheme();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <Container maxWidth="100vw" sx={{ p: 2, mb: 4 }}>
        <Box className='headerBox'>
          <Box className='headerLeftBox' display="flex" alignItems="center" sx={{ mr: 4 }}>
            <IconButton 
              onClick={toggleDrawer(true)}
              aria-label="menu" 
              size="large" 
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Link href="/" underline="none" className='logo' color='primary'>
              <Typography className='logoText' sx={{ fontSize: "1.5rem" }}>framerate</Typography>
            </Link>
          </Box>
          <SearchBar />

          {/* <Link to="/">Home</Link>
          <Link to="/q">Quiz</Link>
          <Link to="/search-results">Search Results</Link> */}
          {/* <IconButton aria-label="Mode" onClick={toggleTheme}>
            <ContrastIcon />
          </IconButton> */}
        </Box>
      </Container>

      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} >
          <List>
            <ListItem disablePadding>
              <ListItemButton href="/">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText>
                  {t('drawer.home')}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
          <Divider></Divider>
          <List>
            {i18n.language == 'en' ? (
              <ListItem disablePadding>
                <ListItemButton onClick={() => changeLanguage('fr')}>
                  <ListItemIcon>
                    <TranslateIcon />
                  </ListItemIcon>
                  <ListItemText>
                    Français
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem disablePadding>
                <ListItemButton onClick={() => changeLanguage('en')}>
                  <ListItemIcon>
                    <TranslateIcon />
                  </ListItemIcon>
                  <ListItemText>
                    English
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton onClick={toggleTheme}>
                <ListItemIcon>
                  {mode == 'dark' ? (
                    <LightModeIcon />
                  ):(
                    <NightlightIcon />
                  )}
                </ListItemIcon>
                <ListItemText>
                  {mode == 'dark' ? (
                    t('drawer.lightMode')
                  ):(
                    t('drawer.darkMode')
                  )}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;