import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Typography, Card, CardMedia, CardContent, IconButton, TextField, Autocomplete } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import gameService from "../../../../services/gameService";

const LinkActorGameForm = ({ actorI, handleSelectActor }) => {
  const { t, i18n } = useTranslation();
  const [currentActor, setCurrentActor] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const actor = await gameService.getRandomActor(i18n.language);
        setCurrentActor(actor);
        handleSelectActor(actorI, actor.id);
      } catch (error) {
        console.error("Error fetching actor:", error);
      }
    };
    fetchActors();
  }, []);

  useEffect(() => {
    if (inputValue.length >= 5) {
      const fetchData = async () => {
        try {
          const results = await gameService.searchActor(i18n.language, inputValue);
          setOptions(results);
        } catch (error) {
          console.error('Error searching actor', error);
        }
      };

      fetchData();
    } else {
      setOptions([]);
    }
  }, [inputValue]);

  const handleRefreshActor = async () => {
    const actor = await gameService.getRandomActor(i18n.language);
    setCurrentActor(actor);
    handleSelectActor(actorI, actor.id);
  }

  const handleSelectSearchedActor = (event, actor) => {
    setCurrentActor(actor);
    handleSelectActor(actorI, actor.id);
  }

  if(currentActor == null) {
    return "";
  }

  return (
    <Card sx={{ position: 'relative' }}>
      <IconButton
        onClick={handleRefreshActor}
        aria-label="refresh"
        sx={{ position: 'absolute', right: 2, top: 2 }}
      >
        <RefreshIcon />
      </IconButton>
      <CardMedia
        sx={{ width: '100%', height: '100%', aspectRatio: '1' }}
        image={`https://image.tmdb.org/t/p/w200${currentActor.profile_path}.jpg`}
        alt={`${currentActor.name}`}
      />
      <CardContent>
        <Typography noWrap variant="body1">{`${currentActor.name}`}</Typography>
      </CardContent>
      <Autocomplete
        freeSolo
        disableClearable={true}
        options={options}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('gameForm.searchActor')}
            variant="outlined"
            size="small"
            onChange={(event) => setInputValue(event.target.value)}
          />
        )}
        onChange={handleSelectSearchedActor}
      />
    </Card>
  );
};

export default LinkActorGameForm;
