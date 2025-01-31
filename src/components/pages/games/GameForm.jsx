import { useTranslation } from 'react-i18next';
import { Box, Typography } from "@mui/material";
import DirectorCastGameForm from "./forms/DirectorCastGameForm";
import BestRatedGameForm from './forms/BestRatedGameForm';
import LinkGameForm from './forms/LinkGameForm';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "400px",
  maxWidth: "75%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  color: "text.primary",
  boxShadow: 24,
  p: 4,
};

const GameForm = ({ game }) => {
  const { t } = useTranslation();

  let form = (<></>);
  if(game.id === 'director' || game.id === 'cast') {
    form = (<DirectorCastGameForm type={game.id} />);
  } else if(game.id === "bestRated") {
    form = (<BestRatedGameForm type={game.id} />);
  } else if(game.id === "link") {
    form = (<LinkGameForm type={game.id} />);
  }
  
  return (
    <Box sx={style}>
      <Typography variant='h5' color='primary'>
        { t(game.titleKey) }
      </Typography>
      <Typography variant='body1'>
        { t(game.descriptionKey) }
      </Typography>

      {form}
    </Box>
  );
};

export default GameForm;
