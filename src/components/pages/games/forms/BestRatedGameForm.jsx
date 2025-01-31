import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, FormControl, Select, MenuItem, Button, InputLabel } from "@mui/material";
import gameService from "../../../../services/gameService";

const BestRatedGameForm = ({ type }) => {
  const { t } = useTranslation();
  const [difficulties, setDifficulties] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const difficulties = gameService.getDifficulties();
    setDifficulties(difficulties);
    setSelectedDifficulty(difficulties[1].id);
  }, []);

  const handleSelectedDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/game?type=${type}&difficulty=${selectedDifficulty}`);
  };

  return (
    <>
      <Typography variant="h6" sx={{ mt: 4 }}>
        { t('gameForm.modalTitle') }
      </Typography>

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>{t('gameForm.difficulty')}</InputLabel>
          <Select
            label={t('gameForm.difficulty')}
            id="game-difficulty"
            value={selectedDifficulty}
            onChange={handleSelectedDifficultyChange}
          >
            {difficulties.map(difficulty => (
              <MenuItem value={difficulty.id} key={difficulty.id}>{t('gameForm.' + difficulty.id)}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        {t('gameForm.startGame')}
        </Button>
      </form>
    </>
  );
};

export default BestRatedGameForm;
