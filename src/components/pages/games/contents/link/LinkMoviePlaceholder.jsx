import { Avatar } from "@mui/material";
import MovieIcon from '@mui/icons-material/Movie';

const LinkMoviePlaceholder = ({ focused, handleFocusPlaceholder }) => {
  return (
    <Avatar
      alt=""
      src=""
      sx={{ width: 70, height: 105, borderRadius: '4px' }}
      className={`link-placeholder ${focused ? "link-focused-placeholder" : ""}`}
      onClick={(event) => handleFocusPlaceholder(event, 'movie')}
    >
      <MovieIcon />
    </Avatar>
  );
};

export default LinkMoviePlaceholder;