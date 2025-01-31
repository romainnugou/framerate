import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';
import gameService from '../../../services/gameService';


const GameCard = ({ type, handleOpenConfigModal, handleQuickGame }) => {
  const { t } = useTranslation();
  const [game, setGame] = useState('');

  useEffect(() => {
    setGame(gameService.gameInfo(type));
  }, [type]);

  return (
    <Card 
      variant="outlined" 
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        opacity: game.available ? 1 : 0.33
      }}
    >
      <CardMedia
        sx={{ height: 150 }}
        image={`/images/game-${game.id}.jpg`}
        title={ t(game.titleKey) }
      />
      <CardContent>
        <Typography variant='h5' color='primary'>
          { t(game.titleKey) }
        </Typography>
        <Typography variant='body1'>
          { t(game.descriptionKey) }
        </Typography>
      </CardContent>
      <CardActions sx={{ textAlign: 'center'}}>
        {game.available ? (
          <>
            <Button 
              variant={game.quickGame ? 'outlined' : 'contained'} 
              fullWidth 
              onClick={() => handleOpenConfigModal(type)}
            >
              {game.quickGame ? t('gameCard.configure') : t('gameCard.letsPlay')}
            </Button>
            {game.quickGame ? (
            <Button 
              variant='contained' 
              fullWidth 
              onClick={() => handleQuickGame(type)}
            >
              {t('gameCard.quickGame')}
            </Button>
            ) : ''}
          </>
        ) : (
          <Button 
             variant='outlined' 
             fullWidth
             disabled
           >
             {t('gameCard.comingSoon')}
           </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default GameCard;