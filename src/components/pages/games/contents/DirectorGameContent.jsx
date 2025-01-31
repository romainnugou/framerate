import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Fade, Card, CardMedia, CardContent, Typography, TextField, Grid, Button, Skeleton } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import gameService from "../../../../services/gameService";

const DirectorGameContent = ({ params }) => {
  const { t, i18n } = useTranslation();
  const [gameContent, setGameContent] = useState(null);
  const [gameDisplayed, setGameDisplayed] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [answer, setAnswer] = useState('');
  const [guess, setGuess] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if(params.regions && params.start && params.end && params.difficulty) {
      gameService.directorGameContent(i18n.language, params.regions, params.start, params.end, params.difficulty).then((data) => {
        setGameContent(data);
        setGameDisplayed(true);

        let directors = '';
        data.directors.map(director => {
          directors += directors.length > 0 ? ', ' : '';
          directors += director.name;
        })
        setAnswer(directors);
      });
    }
  }, [params]);

  const handleGuessChange = (event) => {
    const guess = event.target.value;
    setGuess(guess);

    if(gameService.compareString(guess, answer)) {
      setSuccess(true);
    }
  }

  const handleNextMovie = () => {
    window.location.reload();
  }

  const handleRevealAnswer = () => {
    setAnswerRevealed(true);
  }

  if (!gameDisplayed) {
    return null;
  }

  return (
    <Fade in={gameDisplayed}>
      <Card sx={{ position: 'relative' }}>
        <CardMedia
          className="gameBackdrop"
          image={`https://image.tmdb.org/t/p/w1280${gameContent.movie.backdrop_path}.jpg`}
          title={gameContent.movie.title}
        />
        <CardMedia
          className="gamePoster"
          image={`https://image.tmdb.org/t/p/w342${gameContent.movie.poster_path}.jpg`}
          title={gameContent.movie.title}
        />
        <Skeleton variant="rounded" animation="wave" className="gamePoster" />
        <CardContent className="gameCardContent">
          <Typography gutterBottom variant="h3" component="div" className="gameH3">
            {gameContent.movie.title} <span className="gameH3Span">{gameContent.movie.release_date.substring(0,4)}</span>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {gameContent.movie.overview}
          </Typography>
        </CardContent>
        <CardContent>
          <TextField 
            className={`game-field ${success ? "game-field-success" : ""} ${answerRevealed ? "game-field-revealed" : ""}`}
            disabled={answerRevealed || success}
            variant="outlined"
            fullWidth
            placeholder={ t('games.director.guessFieldPlaceholder') }
            autoFocus
            inputProps={{style: {fontSize: 30, textAlign: 'center'}}}
            InputLabelProps={{style: {fontSize: 30, textAlign: 'center'}}}
            value={(answerRevealed || success) ? answer : guess}
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
                { t('gameContent.revealAnswer') }
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

export default DirectorGameContent;
