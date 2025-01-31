import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ListItem, ListItemText, ListItemAvatar, Avatar, Button} from "@mui/material";

const SearchResultPerson = ({ person }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBestRatedGame = (event, personId) => {
    event.preventDefault();
    navigate(`/game?type=bestRated&difficulty=medium&personId=${personId}`);
  };

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar
          alt={`${person.name}`}
          src={`https://image.tmdb.org/t/p/w200${person.profile_path}.jpg`}
        />
      </ListItemAvatar>
      <ListItemText
        primary={`${person.name}`}
        secondary={
          <React.Fragment>
            <Button
              onClick={(event) => handleBestRatedGame(event, person.id)}
              size="small"
            >
              { t('games.bestRated.title') }
            </Button>
          </React.Fragment>
        }
      />
    </ListItem>
  );
};

export default SearchResultPerson;
