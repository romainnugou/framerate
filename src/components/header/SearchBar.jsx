import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Select, MenuItem, Paper, IconButton, InputBase } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBar = () => {
  const { t } = useTranslation();
  const types = [
    {id: 'person', label: t('search.person')},
    {id: 'movie', label: t('search.movie')},
  ];
  const [type, setType] = useState(types[0].id);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const handleChangeQuery = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== '') {
      navigate(`/search?type=${type}&query=${query}`);
    }
  };

  return (
    <Paper
      component="form" onSubmit={handleSearch}
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', flexGrow: 1, maxWidth: '600px' }}
    >
      <Select 
        value={type} onChange={handleChangeType}
        sx={{
          boxShadow: "none",
          ".MuiOutlinedInput-notchedOutline": { border: 0 },
          "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { border: 0 },
          "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { border: 0 }
        }}
      >
        {types.map(type => (
          <MenuItem value={type.id} key={type.id}>{type.label}</MenuItem>
        ))}
      </Select>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={t('search.placeholder')}
        value={query} onChange={handleChangeQuery}
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton 
        type="submit"
        sx={{ p: '10px' }}
        aria-label="search"
        disabled={query.trim() === ''}
      >
        <Search />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;