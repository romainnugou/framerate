import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Grid, Typography, Modal } from '@mui/material';
import gameService from '../../../services/gameService';
import GameCard from '../games/GameCard';
import GameForm from '../games/GameForm';


const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const games = ['link', 'director', 'cast', 'bestRated'];
  const [selectedGame, setSelectedGame] = useState('');
  const [configModalOpen, setConfigModalOpen] = useState(false);

  const handleOpenConfigModal = (type) => {
    setSelectedGame(gameService.gameInfo(type));
    setConfigModalOpen(true);
  }

  const handleQuickGame = (type) => {
    navigate(gameService.getQuickGameUrl(type));
  }

  const handleCloseConfigModal = () => {
    setSelectedGame('');
    setConfigModalOpen(false);
  }

  return (
    <>
      <Container>
        {/* <Typography variant='h3' sx={{ mt: 2 }}>{t('home.title')}</Typography> */}
        <Typography variant='h4' sx={{ mb: 4 }}>{t('home.subtitle')}</Typography>

        <Grid container spacing={2}>
          {games.map((game) => (
            <Grid key={game} item xs={12} sm={6} md={6}>
              <GameCard
                type={game}
                handleOpenConfigModal={handleOpenConfigModal}
                handleQuickGame={handleQuickGame}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Modal
        open={configModalOpen}
        onClose={() => handleCloseConfigModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <GameForm game={selectedGame} />
        </>
      </Modal>
    </>
  );
};

export default Home;
