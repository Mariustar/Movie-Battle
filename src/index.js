"use strict";
import "regenerator-runtime/runtime";
import axios from "axios";
import { createAutocomplete } from "./autocomplete";

export const API_KEY = "37f0afe1ca89fac4c1d8f7b18798c757";

//! Create autocomplete
// a simple object which has 3 functions/methods inside
const autocompleteConfig = {
  // first method renders the html on the page for every movie in the dropdown menu
  renderOption(movie) {
    const imgSrc = movie.poster_path === null ? "" : movie.poster_path;
    return `
      <img src="https://image.tmdb.org/t/p/w500${imgSrc}">
      ${movie.original_title} (${movie.release_date.slice(0, 4)})
    `;
  },
  // second method gets the movie title
  inputValue(movie) {
    return movie.original_title;
  },

  // third method, make a request to the api and return an array
  async fetchData(searchTerm) {
    try {
      const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
        params: {
          api_key: API_KEY,
          query: searchTerm,
          include_adult: false,
        },
      });
      return response.data.results;
    } catch (error) {
      console.error(error);
    }
  },
};

createAutocomplete({
  ...autocompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    onMovieSelect(movie, document.querySelector(`#left-summary`), "left");
  },
});

createAutocomplete({
  ...autocompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    onMovieSelect(movie, document.querySelector(`#right-summary`), "right");
  },
});

let movieLeft;
let movieRight;

//! Follow up request for the movie id and inserting the html in the html file
const onMovieSelect = async (movie, summaryElement, side) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
      params: {
        api_key: API_KEY,
      },
    });
    summaryElement.innerHTML = movieTemplate(response.data);
    document.querySelector(".tutorial").classList.add("is-hidden");

    const linkArr = await getYoutubeLink(movie);
    const links = [];

    for await (let l of linkArr) {
      if (l.name.includes("Trailer")) {
        links.push(l.key);
      }
    }
    if (side === "left") {
      movieLeft = response.data;
      document
        .querySelector("#left-summary")
        .insertAdjacentHTML(
          "afterbegin",
          `<a href="https://www.youtube.com/watch?v=${links[0]}" class="trailer" target="_blank"> TRAILER </a>`,
        );
    } else if (side === "right") {
      movieRight = response.data;
      document
        .querySelector("#right-summary")
        .insertAdjacentHTML(
          "afterbegin",
          `<a href="https://www.youtube.com/watch?v=${links[0]}" class="trailer" target="_blank"> TRAILER </a>`,
        );
    }

    if (movieLeft && movieRight) {
      runComparison();
    }
  } catch (error) {
    console.log(error);
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll("#left-summary .notification");
  const rightSideStats = document.querySelectorAll("#right-summary .notification");

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = leftStat.dataset.value;
    const rightSideValue = rightStat.dataset.value;

    if (leftSideValue < rightSideValue) {
      rightStat.classList.remove("is-warning", "is-danger");
      leftStat.classList.remove("is-warning", "is-primary");
      rightStat.classList.add("is-primary");
      leftStat.classList.add("is-danger");
    } else if (leftSideValue > rightSideValue) {
      leftStat.classList.remove("is-warning", "is-danger");
      rightStat.classList.remove("is-warning", "is-primary");
      leftStat.classList.add("is-primary");
      rightStat.classList.add("is-danger");
    } else {
      rightStat.classList.add("is-warning");
      leftStat.classList.add("is-warning");
    }
  });
};

const getYoutubeLink = async (movie) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos`, {
      params: {
        api_key: API_KEY,
        language: "en-US",
      },
    });
    const result = response.data.results;
    return result;
  } catch (error) {
    console.log(error);
  }
};

const movieTemplate = (movieDetail) => {
  //! Get movie genres
  const genresArr = [];
  const getGenre = (genres) => {
    genres.forEach((g) => {
      genresArr.push(` ${g.name}`);
    });
  };
  getGenre([...movieDetail.genres]);
  //!--

  return `
      <article class="media">
        <figure class="media-left">
          <p class="image">
            <a href="https://www.imdb.com/title/${
              movieDetail.imdb_id
            }" target="_blank"><img src="https://image.tmdb.org/t/p/w300${
    movieDetail.poster_path
  }"></a>
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <h1>${movieDetail.original_title} - ${movieDetail.release_date.slice(0, 4)}</h1>
            <h4>${genresArr}</h4>
            <p>${movieDetail.overview}</p>
          </div>
        </div>
      </article>
      <article data-value="${movieDetail.vote_average}" class="notification is-primary">
        <p class="title">${movieDetail.vote_average}</p>
        <p class="subtitle">Vote Average</p>
      </article>
      <article data-value="${movieDetail.budget}" class="notification is-primary">
        <p class="title">${movieDetail.budget.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}</p>
        <p class="subtitle">Budget</p>
      </article>
      <article data-value="${movieDetail.revenue}" class="notification is-primary">
        <p class="title">${movieDetail.revenue.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}</p>
        <p class="subtitle">Box Office</p>
      </article>
      <article data-value="${movieDetail.vote_count}" class="notification is-primary">
        <p class="title">${movieDetail.vote_count.toLocaleString()}</p>
        <p class="subtitle">Vote Count</p>
      </article>
      <article data-value="${movieDetail.runtime}" class="notification is-primary">
        <p class="title">${movieDetail.runtime}</p>
        <p class="subtitle">Runtime</p>
      </article>
      <article class="notification is-warning">
        <p class="title">${movieDetail.release_date}</p>
        <p class="subtitle">Release Date</p>
      </article>
    `;
};
