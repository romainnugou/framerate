import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Container, Typography, Grid } from "@mui/material";
import apiService from "../../../services/apiService";
import SearchResultMovie from "./SearchResultMovie";
import SearchResultPerson from "./SearchResultPerson";

const SearchResults = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [type, setType] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type");
    const query = queryParams.get("query");

    if (type && query) {
      apiService.search(i18n.language, type, query).then((data) => {
        setType(type);
        setResults(data.results); // Assume que l'API renvoie un objet avec une propriété 'results'
      });
    }
  }, [location.search]);

  return (
    <Container>
      <Typography variant="h3" sx={{ mb: 2 }}>Search results</Typography>
      <Grid container spacing={2}>
        {results.map((result) => (
          <Grid key={result.id} item xs={12} sm={12} md={6}>
            {type === "movie" ? (
              <SearchResultMovie movie={result} />
            ) : (
              <SearchResultPerson person={result} />
            )}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SearchResults;
