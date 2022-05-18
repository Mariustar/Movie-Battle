"use strict";
import axios from "axios";
import { API_KEY } from "./index";
import { fetchData } from "./index";
import { utils } from "./utils";

//! CREATE THE AUTOCOMPLETE DROPDOWN
const createAutocomplete = ({ root, renderOption }) => {
  root.innerHTML = `
  <label><b>Search for a Movie</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

  const input = root.querySelector(".input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  const onInput = async (e) => {
    const movies = await fetchData(e.target.value);
    console.log(movies);

    resultsWrapper.innerHTML = "";
    dropdown.classList.add("is-active");

    //! Close dropdown when movie array empty or wrong value entered
    // if (!movies) {
    //   dropdown.classList.remove("is-active");

    //   return;
    // }
    // if (!movies[0]) {
    //   dropdown.classList.remove("is-active");
    // }

    // //! Show or hide dropdown
    // input.addEventListener("focus", () => {
    //   if (input.value !== "" && movies.length > 0) {
    //     dropdown.classList.add("is-active");
    //   } else if (!movies || !movies[0]) {
    //     dropdown.classList.remove("is-active");
    //   }
    // });

    movies.forEach((movie) => {
      //   //! Create and add to html movie links (image and title)
      const option = document.createElement("a");
      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(movie);
      resultsWrapper.appendChild(option);

      //   //! Set input text to the movie you clicked
      option.addEventListener("mouseup", () => {
        input.value = movie.original_title;
        dropdown.classList.remove("is-active");
      });
    });

    const onOptionSelect = async (link, id, api) => {
      try {
        const response = await axios.get(`${link}`, {
          params: {
            id: movies.id,
            api_key: API_KEY,
          },
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    //   //! Make a follow up request and get the movie information

    //   const onMovieClick = async () => {
    //     try {
    //       const responseMovie = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
    //         params: {
    //           api_key: API_KEY,
    //           language: "en-US",
    //         },
    //       });
    //       // console.log(responseMovie.data);

    //       document.querySelector("#summary").innerHTML = movieTemplate(responseMovie.data);
    //       // return `https://www.imdb.com/title/${responseMovie.data.imdb_id}`;
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   };

    //   //! Create the template for the movie you clicked

    //   const movieTemplate = (movieDetail) => {
    //     //! Get movie genres
    //     const genresArr = [];
    //     const getGenre = (genres) => {
    //       genres.forEach((g) => {
    //         genresArr.push(` ${g.name}`);
    //       });
    //     };
    //     getGenre([...movieDetail.genres]);
    //     //!--

    //     return `
    //       <article class="media">
    //         <figure class="media-left">
    //           <p class="image">
    //             <img src="https://image.tmdb.org/t/p/w300${imgPosterPath}">
    //           </p>
    //         </figure>
    //         <div class="media-content">
    //           <div class="content">
    //             <h1>${movieDetail.original_title} - ${movieDetail.release_date.slice(0, 4)}</h1>
    //             <h4>${genresArr}</h4>
    //             <p>${movieDetail.overview}</p>
    //           </div>
    //         </div>
    //       </article>
    //       <article class="notification is-primary">
    //         <p class="title">${movieDetail.budget.toLocaleString("en-US", {
    //           style: "currency",
    //           currency: "USD",
    //         })}</p>
    //         <p class="subtitle">Budget</p>
    //       </article>
    //       <article class="notification is-primary">
    //         <p class="title">${movieDetail.revenue.toLocaleString("en-US", {
    //           style: "currency",
    //           currency: "USD",
    //         })}</p>
    //         <p class="subtitle">Box Office</p>
    //       </article>
    //       <article class="notification is-primary">
    //         <p class="title">${movieDetail.vote_count.toLocaleString()}</p>
    //         <p class="subtitle">Vote Count</p>
    //       </article>
    //       <article class="notification is-primary">
    //         <p class="title">${movieDetail.runtime}</p>
    //         <p class="subtitle">Runtime</p>
    //       </article>
    //       <article class="notification is-primary">
    //         <p class="title">${movieDetail.vote_average}</p>
    //         <p class="subtitle">Vote Average</p>
    //       </article>
    //       <article class="notification is-primary">
    //         <p class="title">${movieDetail.release_date}</p>
    //         <p class="subtitle">Release Date</p>
    //       </article>
    //     `;
    //   };

    //   //! Close the dropdown and get info about the clicked movie
    //   option.addEventListener("mousedown", async () => {
    //     // option.setAttribute("href", `${await onMovieClick()}`);
    //     // option.setAttribute("target", "_blank");
    //     await onMovieClick();
    //   });
  };

  input.addEventListener("input", utils(onInput));

  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};

export { createAutocomplete as autoComplete };
