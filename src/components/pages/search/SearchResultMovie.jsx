import { ListItem, ListItemText, ListItemAvatar, Avatar,} from "@mui/material";


const SearchResultMovie = ({ movie }) => {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar
          alt={`${movie.title}`}
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}.jpg`}
        />
      </ListItemAvatar>
      <ListItemText primary={`${movie.title}`} />
    </ListItem>
  );
};

export default SearchResultMovie;
