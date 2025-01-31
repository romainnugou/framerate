import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Fade, Box, Card, CardMedia, CardContent, Typography, TextField, Grid, Button, Skeleton, InputAdornment, Alert } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import gameService from "../../../../services/gameService";

const BestRatedGameContent = ({ params }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [gameContent, setGameContent] = useState(null);
  const [gameDisplayed, setGameDisplayed] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [guesses, setGuesses] = useState([
    { id: 1, answer: '', success: false },
    { id: 2, answer: '', success: false },
    { id: 3, answer: '', success: false },
    { id: 4, answer: '', success: false },
    { id: 5, answer: '', success: false },
  ]);
  const [guess, setGuess] = useState('');
  const [success, setSuccess] = useState(false);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    if(params.difficulty) {
      gameService.bestRatedGameContent(i18n.language, params.difficulty, params.personId ? params.personId : null).then((data) => {
        if(data.person.gender == 1) {
          data.job = data.type == "acting" ? t('games.bestRated.actress') : t('games.bestRated.directress');
        } else {
          data.job = data.type == "acting" ? t('games.bestRated.actor') : t('games.bestRated.director');
        }

        setGameContent(data);

        if(data.movies != null) {
          setGameDisplayed(true);
  
          if (data && data.movies) {
            const updatedGuesses = guesses.map((guess, index) => ({
              ...guess,
              answer: data.movies[index] ? data.movies[index].title : guess.answer,
            }));
            setGuesses(updatedGuesses);
          }
        } else {
          setNoData(true);
        }
      });
    }
  }, [params]);

  const handleGuessChange = (event) => {
    const newGuess = event.target.value;
    let haveNewSuccess = false;

    const updatedGuesses = guesses.map(guess => {
      const isSuccess = gameService.compareString(newGuess, guess.answer);
      if (isSuccess && !guess.success) {
        haveNewSuccess = true;
      }
      return {
        ...guess,
        success: isSuccess ? true : guess.success,
      };
    });

    if(updatedGuesses.every(guess => guess.success)) {
      setSuccess(true);
    }

    setGuesses(updatedGuesses);

    if(haveNewSuccess) {
      setGuess('');
    } else {
      setGuess(newGuess);
    }
  }

  const handleNextMovie = () => {
    if(params.personId != null) {
      navigate(`/game?type=bestRated&difficulty=${params.difficulty}`);
    } else {
      window.location.reload();
    }
  }

  const handleRevealAnswer = () => {
    setGuess('');
    setAnswerRevealed(true);
  }

  if (!gameDisplayed) {
    return null;
  }

  if(noData) {
    return (
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Alert severity="error" variant="outlined">{ t('gameContent.noEnoughDataPerson') }</Alert>
      </Box>
    );
  }

  return (
    <Fade in={gameDisplayed}>
      <Card sx={{ position: 'relative' }}>
        <CardMedia
          className="gameProfilePic"
          image={`https://image.tmdb.org/t/p/h632${gameContent.person.profile_path}.jpg`}
          title={gameContent.person.name}
        />
        <Skeleton variant="rounded" animation="wave" className="gameProfilePic" />
        <CardContent className="gameCardContent gameCardContentBestRatedTitle">
          <Typography gutterBottom variant="h3" component="div" className="gameH3">
            {gameContent.person.name} <span className="gameH3Span">{gameContent.job}</span>
          </Typography>
        </CardContent>
        <CardContent className="gameCardContentCasting">
          {guesses.map(guess => (
            <TextField 
              key={guess.id}
              value={(guess.success || answerRevealed) ? guess.answer : ''}
              className={`game-field ${guess.success ? "game-field-success" : (answerRevealed ? "game-field-revealed" : "")}`}
              disabled
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start">{guess.id}</InputAdornment>,
              }}
            ></TextField>
          ))}
        </CardContent>
        <CardContent>
          <TextField 
            className='game-field'
            disabled={answerRevealed || success}
            variant="outlined"
            fullWidth
            placeholder={ t('games.bestRated.guessFieldPlaceholder') }
            autoFocus
            inputProps={{style: {fontSize: 30, textAlign: 'center'}}}
            InputLabelProps={{style: {fontSize: 30, textAlign: 'center'}}}
            value={success ? '' : guess}
            onChange={handleGuessChange}
          />
        </CardContent>
        <CardContent className="gameButtonsCardContent">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button 
                variant="outlined"
                fullWidth
                size="large"
                onClick={handleRevealAnswer}
                disabled={answerRevealed || success}
                endIcon={<CheckIcon />}
              >
                { t('gameContent.revealAnswers') }
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleNextMovie}
                endIcon={<ArrowForwardIcon />}
              >
                { t('gameContent.nextMovie') }
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default BestRatedGameContent;
