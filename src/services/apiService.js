const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

let cachedRegions = null;

const apiService = {
  // Search
  search: async (language, type, query) => {
    const url = `${BASE_URL}/search/${type}?language=${language}&api_key=${API_KEY}&query=${encodeURIComponent(query)}&sort_by=vote_average.desc`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  },

  // Regions
  fetchRegions: async (language) => {
    if (cachedRegions) {
      return cachedRegions;
    }

    const url = `${BASE_URL}/watch/providers/regions?language=${language}&api_key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    cachedRegions = data.results;
    return cachedRegions;
  },

  // Discover movies
  fetchDiscoverMovies: async (language, page, sortBy, regions, startDate, endDate) => {
    let url = `${BASE_URL}/discover/movie?language=${language}&api_key=${API_KEY}&page=${page}&sort_by=${sortBy}&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}`;
    if(regions != 'all') {
      url += `&with_origin_country=${regions}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    return data;
  },

  // Movie credits
  fetchMovieCredits: async (language, movieId) => {
    const url = `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=${language}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  },

  // Popular persons
  fetchPopularPersons: async (language, page) => {
    const url = `${BASE_URL}/person/popular?api_key=${API_KEY}&language=${language}&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  },

  // Popular persons
  fetchPersonDetails: async (language, personId) => {
    const url = `${BASE_URL}/person/${personId}?api_key=${API_KEY}&language=${language}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  },

  // Person movie credits
  fetchPersonMovieCredits: async (language, personId) => {
    const url = `${BASE_URL}/person/${personId}/movie_credits?api_key=${API_KEY}&language=${language}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  },
};

export default apiService;