import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, FormControl, Select, MenuItem, Button, InputLabel, Box, TextField } from "@mui/material";
import apiService from "../../../../services/apiService";
import gameService from "../../../../services/gameService";

const DirectorCastGameForm = ({ type }) => {
  const { t, i18n } = useTranslation();
  const [regions, setRegions] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [startDate, setStartDate] = useState(2000);
  const [endDate, setEndDate] = useState(2024);
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regions = await apiService.fetchRegions(i18n.language);
        setRegions(regions);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };
    fetchRegions();

    const difficulties = gameService.getDifficulties();
    setDifficulties(difficulties);
    setSelectedDifficulty(difficulties[1].id);
  }, []);

  const handleSelectedRegionChange = (event) => {
    setSelectedRegions(event.target.value);
  };

  const validateYear = (year) => {
    let yearNumber = parseInt(year, 10);
    return !isNaN(yearNumber) && year.length === 4;
  };

  const handleStartDateChange = (event) => {
    const { value } = event.target;
    if (value === '' || validateYear(value)) {
      setStartDate(value);
    }
  };

  const handleEndDateChange = (event) => {
    const { value } = event.target;
    if (value === '' || validateYear(value)) {
      setEndDate(value);
    }
  };

  const handleSelectedDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const regions = selectedRegions.length == 0 ? 'all' : selectedRegions.join('|');
    navigate(`/game?type=${type}&regions=${regions}&start=${startDate}&end=${endDate}&difficulty=${selectedDifficulty}`);
  };

  return (
    <>
      <Typography variant="h6" sx={{ mt: 4 }}>
        { t('gameForm.modalTitle') }
      </Typography>

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>{t('gameForm.countries')}</InputLabel>
          <Select
            label={t('gameForm.countries')}
            multiple
            value={selectedRegions}
            onChange={handleSelectedRegionChange}
          >
            {regions.map(region => (
              <MenuItem value={region.iso_3166_1} key={region.iso_3166_1}>{region.native_name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" justifyContent="space-between" width="100%" sx={{ mt: 2 }}>
          <TextField
            label={t('gameForm.between')}
            value={startDate}
            onChange={handleStartDateChange}
            variant="outlined"
            type="number"
            fullWidth
            inputProps={{ maxLength: 4, max: currentYear }}
            sx={{ marginRight: 1 }}
          />
          <TextField
            label={t('gameForm.and')}
            value={endDate}
            onChange={handleEndDateChange}
            variant="outlined"
            type="number"
            fullWidth
            inputProps={{ maxLength: 4, max: currentYear }}
          />
        </Box>

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

export default DirectorCastGameForm;
