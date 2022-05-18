"use strict";
import "regenerator-runtime/runtime";
import axios from "axios";
import { autoComplete } from "./autocomplete";
import { utils } from "./utils";

export const API_KEY = "37f0afe1ca89fac4c1d8f7b18798c757";

//! REQUESTING THE SEARCHED MOVIE
export const fetchData = async (searchTerm) => {
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
};

//! CREATE AUTOCOMPLETE DROPDOWNS
autoComplete({
  root: document.querySelector(".autocomplete"),
  renderOption(movie) {
    const imgSrc = movie.poster_path === null ? "" : movie.poster_path;
    return `
      <img src="https://image.tmdb.org/t/p/w500${imgSrc}">
      ${movie.original_title} (${movie.release_date.slice(0, 4)})
    `;
  },
  onOptionSelect(link) {},
});

// autoComplete({
//   root: document.querySelector(".autocomplete-two"),
// });
