import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, Grid, Button } from "@mui/material";
import LinkActorGameForm from "./LinkActorGameForm";

const LinkGameForm = ({ type }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedActor1, setSelectedActor1] = useState(-1);
  const [selectedActor2, setSelectedActor2] = useState(-1);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/game?type=${type}&actor1=${selectedActor1}&actor2=${selectedActor2}`);
  };

  const handleSelectActor = (actorI, actorId) => {
    actorI == 1 ? setSelectedActor1(actorId) : setSelectedActor2(actorId);
  }

  return (
    <>
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        { t('gameForm.modalTitle') }
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <LinkActorGameForm actorI="1" handleSelectActor={handleSelectActor} />
          </Grid>
          <Grid item xs={6}>
            <LinkActorGameForm actorI="2" handleSelectActor={handleSelectActor} />
          </Grid>
        </Grid>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 4 }}>
        {t('gameForm.startGame')}
        </Button>
      </form>
    </>
  );
};

export default LinkGameForm;
