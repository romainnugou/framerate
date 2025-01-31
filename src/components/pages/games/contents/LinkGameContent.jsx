import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Fade, Card, CardContent, Box, Typography, Autocomplete, TextField, IconButton } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import gameService from "../../../../services/gameService";
import LinkActor from "./link/LinkActor";
import LinkActorPlaceholder from "./link/LinkActorPlaceholder";
import LinkMovie from "./link/LinkMovie";
import LinkMoviePlaceholder from "./link/LinkMoviePlaceholder";

const LinkGameContent = ({ params }) => {
  const { t, i18n } = useTranslation();
  const [title, setTitle] = useState("");
  const [gameDisplayed, setGameDisplayed] = useState(false);

  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);

  const [placeholders, setPlaceholders] = useState([]);
  const [focusedPlaceholder, setFocusedPlaceholder] = useState('');

  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [success, setSuccess] = useState(false);

  // Init game
  useEffect(() => {
    if(params.actor1 && params.actor2) {
      const fetchActors = async () => {
        const actor1 = await gameService.getActorInfoForLink(i18n.language, params.actor1);
        const actor2 = await gameService.getActorInfoForLink(i18n.language, params.actor2);

        setTitle(`${t('games.link.from')} ${actor1.name} ${t('games.link.to')} ${actor2.name}`);

        setLeftItems([actor1]);
        setRightItems([actor2]);

        setGameDisplayed(true);
      };
      fetchActors();
    }
  }, [params]);

  // When lists are updated
  useEffect(() => {
    setInputValue('');
    createPlaceholders();

    if(success) {
      setInputValue(t('games.link.congratulations'));
    }
  }, [leftItems, rightItems]);

  // When we type in the field
  useEffect(() => {
    if (inputValue.length >= 3) {
      if(focusedPlaceholder == 'movie') {
        const left = getActiveLeftItem();
        const right = getActiveRightItem();

        const results = gameService.searchMoviesFromCasts(
          inputValue,
          (left !== null && left.name && left.cast) ? left.cast : null,
          (right !== null && right.name && right.cast) ? right.cast : null
        );
        setOptions(results);
      } else if(focusedPlaceholder == 'actor') {
        const left = getActiveLeftItem();
        const right = getActiveRightItem();

        const results = gameService.searchActorsFromCasts(
          inputValue, 
          (left !== null && left.title && left.cast) ? left.cast : null, 
          (right !== null && right.title && right.cast) ? right.cast : null
        );
        setOptions(results);
      }
    } else {
      setOptions([]);
    }
  }, [inputValue]);

  // Get active left item (last item of left list)
  const getActiveLeftItem = () => {
    if(leftItems.length > 0) {
      return leftItems[leftItems.length - 1];
    }
    return null;
  };

  // Get active right item (first item of right list)
  const getActiveRightItem = () => {
    if(rightItems.length > 0) {
      return rightItems[0];
    }
    return null;
  };

  // To set focus on a placeholder
  const handleFocusPlaceholder = (event, item) => {
    setInputValue('');
    setFocusedPlaceholder(item);
  };

  // To create and place placeholders (according to lists)
  const createPlaceholders = () => {
    const left = getActiveLeftItem();
    const right = getActiveRightItem();

    if(left !== null && right !== null) {
      if(left.name && right.name) {
        setPlaceholders(['movie']);
        setFocusedPlaceholder('movie');
      } else if(left.name && right.title) {
        setPlaceholders(['movie', 'actor']);
        setFocusedPlaceholder('movie');
      } else if(left.title && right.name) {
        setPlaceholders(['actor', 'movie']);
        setFocusedPlaceholder('actor');
      } else  {
        setPlaceholders(['actor']);
        setFocusedPlaceholder('actor');
      }
    }
  };

  // When input field change
  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  // When we choose an autocomplete result
  const handleSelectSearchItem = (event, item) => {
    setInputValue('');
    setOptions([]);

    if(item !== null) {
      if(item.title) {
        // Movie

        if(item.left && item.right) {
          setSuccess(true);
          setLeftItems((prevLeftItems) => [...prevLeftItems, item]);
        } else {
          const fetchMovieCast = async () => {
            const cast = await gameService.getMovieCast(i18n.language, item.id);
            item.cast = cast;

            if(item.left) {
              setLeftItems((prevLeftItems) => [...prevLeftItems, item]);
              createPlaceholders();
            } else if(item.right) {
              setRightItems((prevRightItems) => [item, ...prevRightItems]);
              createPlaceholders();
            }
          };
          fetchMovieCast();
        }
      } else {
        // Actor
        
        item.type = "actor";
        if(item.left && item.right) {
          setSuccess(true);
          setLeftItems((prevLeftItems) => [...prevLeftItems, item]);
        } else {
          const fetchActorCast = async () => {
            const cast = await gameService.getPersonCast(i18n.language, item.id);
            item.cast = cast;

            if(item.left) {
              setLeftItems((prevLeftItems) => [...prevLeftItems, item]);
              createPlaceholders();
            } else if(item.right) {
              setRightItems((prevRightItems) => [item, ...prevRightItems]);
              createPlaceholders();
            }
          };
          fetchActorCast();
        }
      }
    }
  }

  // To delete item
  const handleDeleteItem = (event, side, index) => {
    if(side == 'left' && leftItems.length > 1 && index == (leftItems.length - 1)) {
      setLeftItems((prevLeftItems) => prevLeftItems.slice(0, -1));
    }
    if(side == 'right' && rightItems.length > 1 && index == 0) {
      setRightItems((prevRightItems) => prevRightItems.slice(1));
    }
  }

  const handleRefresh = () => {
    window.location.reload();
  }

  if (!gameDisplayed) {
    return null;
  }

  return (
    <Fade in={gameDisplayed}>
      <Card sx={{ position: 'relative' }}>
        <CardContent>
          <IconButton
            onClick={handleRefresh}
            aria-label="refresh"
            sx={{ position: 'absolute', right: 2, top: 2 }}
          >
            <RefreshIcon />
          </IconButton>
          <Typography variant='h5' sx={{ textAlign: 'center' }}>{title}</Typography>
        </CardContent>
        <CardContent>
          <Box className={`link-container ${success ? 'link-container-success' : ''}`}>
            {leftItems.map((item, index) => {
              if (item.type === 'actor') {
                return (
                  <LinkActor key={item.id} 
                    item={item} 
                    deleteButton={index != 0 && index == (leftItems.length - 1) && !success}
                    handleDeleteItem={(event) => handleDeleteItem(event, 'left', index)}
                  />
                )
              } else {
                return (
                  <LinkMovie key={item.id}
                    item={item} 
                    deleteButton={index != 0 && index == (leftItems.length - 1) && !success}
                    handleDeleteItem={(event) => handleDeleteItem(event, 'left', index)}
                  />
                )
              }
            })}

            {!success && (
              placeholders.map((item) => {
                if (item === 'actor') {
                  return (
                    <LinkActorPlaceholder key={item}
                      focused={focusedPlaceholder == item}
                      handleFocusPlaceholder={handleFocusPlaceholder}
                    />
                  )
                } else if (item === 'movie') {
                  return (
                    <LinkMoviePlaceholder key={item}
                      focused={focusedPlaceholder == item}
                      handleFocusPlaceholder={handleFocusPlaceholder}
                    />
                  )
                }
              })
            )}

            {rightItems.map((item, index) => {
              if (item.type === 'actor') {
                return (
                  <LinkActor key={item.id}
                    item={item} 
                    deleteButton={index == 0 && index != (rightItems.length - 1) && !success}
                    handleDeleteItem={(event) => handleDeleteItem(event, 'right', index)}
                  />
                )
              } else {
                return (
                  <LinkMovie key={item.id}
                    item={item} 
                    deleteButton={index == 0 && index != (rightItems.length - 1) && !success}
                    handleDeleteItem={(event) => handleDeleteItem(event, 'right', index)}
                  />
                )
              }
            })}

            <div className="link-line"></div>
          </Box>
        </CardContent>
        <CardContent>
          <Autocomplete
            freeSolo
            options={options}
            disabled={success}
            getOptionLabel={(option) => option.title ? option.title : option.name}
            getOptionKey={(option) => option.id}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onChange={handleSelectSearchItem}
            renderInput={(params) => (
              <TextField
                {...params}
                className={`game-field ${success ? "game-field-success" : ""}`}
                variant="outlined"
                disabled={success}
                fullWidth
                inputProps={{ ...params.inputProps, style: {fontSize: 30, textAlign: 'center'} }}
                autoFocus
                placeholder={ focusedPlaceholder == 'movie' ? t('games.link.searchMovie') : t('games.link.searchActor') }
              />
            )}
          />
        </CardContent>
      </Card>
    </Fade>
  );
};

export default LinkGameContent;
