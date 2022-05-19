"use strict";
import "regenerator-runtime/runtime";
import axios from "axios";
import { autoComplete } from "./autocomplete";
import { utils } from "./utils";

export const API_KEY = "37f0afe1ca89fac4c1d8f7b18798c757";

//! Create autocomplete
autoComplete({
  root: document.querySelector(".autocomplete"),
  renderOption(movie) {
    const imgSrc = movie.poster_path === null ? "" : movie.poster_path;
    return `
      <img src="https://image.tmdb.org/t/p/w500${imgSrc}">
      ${movie.original_title} (${movie.release_date.slice(0, 4)})
    `;
  },
  onOptionSelect(item) {
    onMovieSelect(item);
  },
  inputValue(item) {
    return item.original_title;
  },
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
});

export const onMovieSelect = async (movie) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
      params: {
        api_key: API_KEY,
      },
    });
    document.querySelector("#summary").innerHTML = movieTemplate(response.data);
    movieDetail();
  } catch (error) {
    console.log(error);
  }
};

// autoComplete({
//   root: document.querySelector(".autocomplete-two"),
// });

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
            <img src="https://image.tmdb.org/t/p/w300${movieDetail.poster_path}">
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
      <article class="notification is-primary">
        <p class="title">${movieDetail.budget.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}</p>
        <p class="subtitle">Budget</p>
      </article>
      <article class="notification is-primary">
        <p class="title">${movieDetail.revenue.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}</p>
        <p class="subtitle">Box Office</p>
      </article>
      <article class="notification is-primary">
        <p class="title">${movieDetail.vote_count.toLocaleString()}</p>
        <p class="subtitle">Vote Count</p>
      </article>
      <article class="notification is-primary">
        <p class="title">${movieDetail.runtime}</p>
        <p class="subtitle">Runtime</p>
      </article>
      <article class="notification is-primary">
        <p class="title">${movieDetail.vote_average}</p>
        <p class="subtitle">Vote Average</p>
      </article>
      <article class="notification is-primary">
        <p class="title">${movieDetail.release_date}</p>
        <p class="subtitle">Release Date</p>
      </article>
    `;
};

//! Close the dropdown and get info about the clicked movie

const movieDetail = async () => {
  await document.querySelector(".dropdown-item").addEventListener("mousedown", async () => {
    await onMovieSelect();
  });
};
