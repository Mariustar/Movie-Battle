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
    onMovieSelect(movie, document.querySelector(`#left-summary`));
  },
});

createAutocomplete({
  ...autocompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    onMovieSelect(movie, document.querySelector(`#right-summary`));
  },
});

//! Follow up request for the movie id and inserting the html in the html file
const onMovieSelect = async (movie, summaryElement) => {
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
    // for (let i = 0; i <= linkArr.length; i += 1) {
    //   if (linkArr[i]["name"].includes("Trailer")) {
    //     links.push(linkArr[i]["key"]);
    //   }
    // }

    for await (let l of linkArr) {
      if (l.name.includes("Trailer")) {
        links.push(l.key);
      }
    }
    document
      .querySelector(".media-left")
      .insertAdjacentHTML(
        "beforeend",
        `<a href="https://www.youtube.com/watch?v=${links[0]}" target="_blank"> TRAILER </a>`,
      );

    // document
    //   .querySelector(".content")
    //   .insertAdjacentHTML(
    //     "afterbegin",
    //     `<a href="https://www.youtube.com/watch?v=${link}"> TRAILER </a>`,
    //   );
  } catch (error) {
    console.log(error);
  }
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

// const movieDetail = async () => {
//   await document.querySelector(".dropdown-item").addEventListener("mousedown", async () => {
//     await onMovieSelect();
//   });
// };
// const linkDetail = async () => {
//   await document.querySelector(".dropdown-item").addEventListener("mousedown", async () => {
//     await getYoutubeLink();
//   });
// };
