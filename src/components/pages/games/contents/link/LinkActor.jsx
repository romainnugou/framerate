import { Tooltip, Avatar, Box, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const LinkActor = ({ item, deleteButton, handleDeleteItem }) => {
  return (
    <Tooltip title={item.name} placement="top" arrow>
      <Box>
        <Avatar
          alt={item.name}
          src={`https://image.tmdb.org/t/p/h632${item.profile_path}.jpg`}
          sx={{ width: 75, height: 75, backgroundColor: 'gray' }}
        />

        {deleteButton && 
          <Box className="link-delete-box">
            <IconButton aria-label="delete" size="small" onClick={handleDeleteItem}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      </Box>
    </Tooltip>
  );
};

export default LinkActor;