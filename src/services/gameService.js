import games from "../configs/games";
import difficulties from "../configs/difficulties";
import apiService from "./apiService";

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const gameService = {
  // Get game info from type
  gameInfo: (type) => {
    return games[type] || {};
  },

  // Get difficulties
  getDifficulties: () => {
    return difficulties || {};
  },

  // Get quick game url
  getQuickGameUrl: (type) => {
    if(type == 'director' || type == 'cast') {
      return `/game?type=${type}&regions=all&start=2000&end=2024&difficulty=medium`;
    } else if(type == 'bestRated') {
      return `/game?type=${type}&difficulty=medium`;
    }
  },

  // Get director's game content from params
  directorGameContent: async (language, regions, start, end, difficulty) => {
    try {
      const startDate = start + '-01-01';
      const endDate = end + '-12-31';
      const sortBy = 'vote_count.desc';

      let max = 100;
      if (difficulty == 'medium') {
        max = 1000;
      } else if (difficulty == 'hard') {
        max = 10000;
      }

      // See how much movies do we have
      const initialData = await apiService.fetchDiscoverMovies(language, 1, sortBy, regions, startDate, endDate);

      const moviesCount = initialData.total_results > max ? max : initialData.total_results;
      const pagesNb = moviesCount / initialData.results.length;
      const pageI = randomNumber(1, pagesNb);
      const movieI = randomNumber(0, initialData.results.length - 1);

      // Get random page of movies
      const randomPageData = await apiService.fetchDiscoverMovies(language, pageI, sortBy, regions, startDate, endDate);
      // Get random movie
      const movie = randomPageData.results[movieI];

      // Get movie director(s) info
      const creditsData = await apiService.fetchMovieCredits(language, movie.id);
      const directors = creditsData.crew.filter(person => person.job === 'Director');

      return {
        movie: movie,
        directors: directors
      };
    } catch (error) {
      console.error("Error fetching director game content:", error);
      throw error;
    }
  },

  // Get cast game content from params
  castGameContent: async (language, regions, start, end, difficulty) => {
    try {
      const startDate = start + '-01-01';
      const endDate = end + '-12-31';
      const sortBy = 'vote_count.desc';

      let max = 100;
      if (difficulty == 'medium') {
        max = 1000;
      } else if (difficulty == 'hard') {
        max = 10000;
      }

      // See how much movies do we have
      const initialData = await apiService.fetchDiscoverMovies(language, 1, sortBy, regions, startDate, endDate);

      const moviesCount = initialData.total_results > max ? max : initialData.total_results;
      const pagesNb = moviesCount / initialData.results.length;
      const pageI = randomNumber(1, pagesNb);
      const movieI = randomNumber(0, initialData.results.length - 1);

      // Get random page of movies
      const randomPageData = await apiService.fetchDiscoverMovies(language, pageI, sortBy, regions, startDate, endDate);
      // Get random movie
      const movie = randomPageData.results[movieI];

      // Get movie cast info
      const creditsData = await apiService.fetchMovieCredits(language, movie.id);
      const cast = creditsData.cast.sort((a, b) => a.order - b.order).slice(0, 5);

      return {
        movie: movie,
        cast: cast
      };
    } catch (error) {
      console.error("Error fetching cast game content:", error);
      throw error;
    }
  },

  // Get best rated game content from params
  bestRatedGameContent: async function(language, difficulty = 'medium', personId = null) {
    try {
      const minVoteCount = 1000;
      const minMovieCount = 5;

      let person;
      let type;
      let movies;

      if(personId == null) {
        // If we don't know person id
        let maxPage = 10;
        if (difficulty == 'medium') {
          maxPage = 100;
        } else if (difficulty == 'hard') {
          maxPage = 1000;
        }
        const pageI = randomNumber(1, maxPage);

        // Fetch popular person
        const popularPersons = await apiService.fetchPopularPersons(language, pageI);
        const personI = randomNumber(0, popularPersons.results.length - 1);
        person = popularPersons.results[personI];
      } else {
        // If we know person id
        person = await apiService.fetchPersonDetails(language, personId);
      }

      // Fetch person movie credits
      const personMovieCredits = await apiService.fetchPersonMovieCredits(language, person.id);

      if(person.known_for_department == 'Acting') {
        // Actress/actor

        type = 'acting';
        movies = personMovieCredits.cast
          .filter(movie => movie.vote_count > minVoteCount)
          .sort((a, b) => b.vote_average - a.vote_average)
          .slice(0, 5);
      } else if(person.known_for_department == 'Directing') {
        // Director

        type = 'directing';
        movies = personMovieCredits.crew
          .filter(movie => movie.job == "Director")
          .filter(movie => movie.vote_count > minVoteCount)
          .sort((a, b) => b.vote_average - a.vote_average)
          .slice(0, 5);
      } else {
        // We try again
        return await this.bestRatedGameContent(language, difficulty, null);
      }

      // If not enough movie
      if(movies.length < minMovieCount) {
        if(personId != null) {
          return {
            person: person,
            type: type,
            movies: null
          };
        }

        // We try again
        return await this.bestRatedGameContent(language, difficulty, null);
      }

      return {
        person: person,
        type: type,
        movies: movies
      };
    } catch (error) {
      console.error("Error fetching cast game content:", error);
      throw error;
    }
  },

  // Get random actor
  getRandomActor: async function(language) {
    const pageI = randomNumber(1, 10);
    const popularPersons = await apiService.fetchPopularPersons(language, pageI);
    const personI = randomNumber(0, popularPersons.results.length - 1);
    const person = popularPersons.results[personI];

    if(person.known_for_department == "Acting") {
      return person;
    } else {
      return await this.getRandomActor(language);
    }
  },

  // Search actor
  searchActor: async function(language, query) {
    const persons = await apiService.search(language, 'person', query);
    const actors = persons.results
      .filter(person => person.known_for_department == "Acting")
      .slice(0, 5);

    return actors;
  },

  // Get actor info for link game
  getActorInfoForLink: async function(language, actorId) {
    const detail = await apiService.fetchPersonDetails(language, actorId);
    const credits = await apiService.fetchPersonMovieCredits(language, actorId);
    const cast = credits.cast;

    return {
      id: actorId, 
      name: detail.name,
      type: 'actor',
      profile_path: detail.profile_path,
      cast: cast
    };
  },

  // Get person cast
  getPersonCast: async function(language, personId) {
    const credits = await apiService.fetchPersonMovieCredits(language, personId);
    return credits.cast;
  },

  // Get movie cast
  getMovieCast: async function(language, movieId) {
    const credits = await apiService.fetchMovieCredits(language, movieId);
    return credits.cast;
  },

  searchActorsFromCasts(query, leftCast, rightCast) {
    function clearText(s) {
      s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return s.toLowerCase().replace(/[^a-z ]/g, '');
    }

    query = clearText(query);
    let results = [];

    if(leftCast !== null) {
      for (let i=0; i<leftCast.length; i++) {
        const name = clearText(leftCast[i].name);
        if(name.includes(query)) {
          let actor = leftCast[i];
          actor.right = (rightCast !== null && rightCast.includes(actor)) ? true : false;
          actor.left = true;

          results.push(actor);
  
          if(results.length >= 5) {
            break;
          }
        }
      }
    }
    if(results.length < 5) {
      if(rightCast !== null) {
        for (let i=0; i<rightCast.length; i++) {
          const name = clearText(rightCast[i].name);
          if(name.includes(query)) {
            let alreadyThere = false;
            for (let j=0; j<results.length; j++) {
              if(results[j].id == rightCast[i].id) {
                results[j].right = true;
                alreadyThere = true;
                break;
              }
            }
  
            if(!alreadyThere) {
              let actor = rightCast[i];
              actor.left = (leftCast !== null && leftCast.includes(actor)) ? true : false;
              actor.right = true;
  
              results.push(actor);
    
              if(results.length >= 5) {
                break;
              }
            }
          }
        }
      }
    }

    return results;
  },

  // Search movies from casts
  searchMoviesFromCasts(query, leftCast, rightCast) {
    function clearText(s) {
      s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return s.toLowerCase().replace(/[^a-z ]/g, '');
    }

    query = clearText(query);
    let results = [];

    if(leftCast !== null) {
      for (let i=0; i<leftCast.length; i++) {
        const title = clearText(leftCast[i].title);
        if(title.includes(query)) {
          let movie = leftCast[i];
          movie.right = (rightCast !== null && rightCast.includes(movie)) ? true : false;
          movie.left = true;
  
          results.push(movie);
  
          if(results.length >= 5) {
            break;
          }
        }
      }
    }
    if(results.length < 5) {
      if(rightCast !== null) {
        for (let i=0; i<rightCast.length; i++) {
          const title = clearText(rightCast[i].title);
          if(title.includes(query)) {
            let alreadyThere = false;
            for (let j=0; j<results.length; j++) {
              if(results[j].id == rightCast[i].id) {
                results[j].right = true;
                alreadyThere = true;
                break;
              }
            }
  
            if(!alreadyThere) {
              let movie = rightCast[i];
              movie.left = (leftCast !== null && leftCast.includes(movie)) ? true : false;
              movie.right = true;
  
              results.push(movie);
    
              if(results.length >= 5) {
                break;
              }
            }
          }
        }
      }
    }

    return results;
  },

  // Compare 2 strings
  compareString: (s1, s2) => {
    function clearText(s) {
      s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return s.toLowerCase().replace(/[^a-z ]/g, '');
    }
    function sortWords(s) {
      return s.split(' ').sort().join(' ');
    }

    s1 = clearText(s1);
    s2 = clearText(s2);
    s1 = sortWords(s1);
    s2 = sortWords(s2);

    function editDistance(s1, s2) {
      var costs = new Array();
      for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
          if (i == 0) {
            costs[j] = j;
          } else {
            if (j > 0) {
              var newValue = costs[j - 1];
              if (s1.charAt(i - 1) != s2.charAt(j - 1))
                newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
              costs[j - 1] = lastValue;
              lastValue = newValue;
            }
          }
        }
        if (i > 0)
          costs[s2.length] = lastValue;
      }
      return costs[s2.length];
    }

    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }

    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength) > 0.8;
  }
};

export default gameService;