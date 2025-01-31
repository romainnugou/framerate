import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Fade, Card, CardMedia, CardContent, Typography, TextField, Grid, Button, Skeleton, InputAdornment } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import gameService from "../../../../services/gameService";

const CastGameContent = ({ params }) => {
  const { t, i18n } = useTranslation();
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

  useEffect(() => {
    if(params.regions && params.start && params.end && params.difficulty) {
      gameService.castGameContent(i18n.language, params.regions, params.start, params.end, params.difficulty).then((data) => {
        setGameContent(data);
        setGameDisplayed(true);

        if (data && data.cast) {
          const updatedGuesses = guesses.map((guess, index) => ({
            ...guess,
            answer: data.cast[index] ? data.cast[index].name : guess.answer,
          }));
          setGuesses(updatedGuesses);
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
    window.location.reload();
  }

  const handleRevealAnswer = () => {
    setGuess('');
    setAnswerRevealed(true);
  }

  if (!gameDisplayed) {
    return null;
  }

  return (
    <Fade in={gameDisplayed}>
      <Card sx={{ position: 'relative' }}>
        <CardMedia
          className="gameBackdrop gameBackdropLight"
          image={`https://image.tmdb.org/t/p/w1280${gameContent.movie.backdrop_path}.jpg`}
          title={gameContent.movie.title}
        />
        <CardMedia
          className="gamePoster"
          image={`https://image.tmdb.org/t/p/w342${gameContent.movie.poster_path}.jpg`}
          title={gameContent.movie.title}
        />
        <Skeleton variant="rounded" animation="wave" className="gamePoster" />
        <CardContent className="gameCardContent gameCardContentTop">
          <Typography gutterBottom variant="h3" component="div" className="gameH3">
            {gameContent.movie.title} <span className="gameH3Span">{gameContent.movie.release_date.substring(0,4)}</span>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {gameContent.movie.overview}
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
            placeholder={ t('games.cast.guessFieldPlaceholder') }
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

export default CastGameContent;
