import { Link, Typography } from '@mui/material';

const Footer = () => {
  return (
      <footer>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 5, py: 2 }}>
          Made by <Link href="https://www.romainnugou.com" target="_blank" rel="noopener noreferrer">Romain Nugou</Link> / Source code on <Link href="https://github.com/romainnugou/framerate" target="_blank" rel="noopener noreferrer">GitHub</Link>
        </Typography>
      </footer>
  );
};

export default Footer;