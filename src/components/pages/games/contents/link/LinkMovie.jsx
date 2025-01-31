import { Tooltip, Avatar, Box, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const LinkMovie = ({ item, deleteButton, handleDeleteItem }) => {
  return (
    <Tooltip title={item.title} placement="top" arrow>
      <Box>
        <Avatar
          alt={item.title}
          src={`https://image.tmdb.org/t/p/w342${item.poster_path}.jpg`}
          sx={{ width: 70, height: 105, borderRadius: '4px', backgroundColor: 'gray' }}
        />

        {deleteButton && 
          <Box className="link-delete-box">
            <IconButton aria-label="delete" size="small"  onClick={handleDeleteItem}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      </Box>
    </Tooltip>
  );
};

export default LinkMovie;