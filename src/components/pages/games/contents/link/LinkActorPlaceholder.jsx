import { Avatar } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';

const LinkActorPlaceholder = ({ focused, handleFocusPlaceholder }) => {
  return (
    <Avatar
      alt=""
      src=""
      sx={{ width: 75, height: 75 }}
      className={`link-placeholder ${focused ? "link-focused-placeholder" : ""}`}
      onClick={(event) => handleFocusPlaceholder(event, 'actor')}
    >
      <PersonIcon />
    </Avatar>
  );
};

export default LinkActorPlaceholder;