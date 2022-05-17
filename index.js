const API_KEY = "37f0afe1ca89fac4c1d8f7b18798c757";

//! Requesting the movie by search term
const fetchData = async (searchTerm) => {
  try {
    const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
      params: {
        api_key: "37f0afe1ca89fac4c1d8f7b18798c757",
        query: searchTerm,
        include_adult: false,
      },
    });
    if (response) {
      return response.data.results;
    }
    return "Nothing here";
  } catch (error) {
    console.log(error);
  }
};

//! Create the dropdown menu
const root = document.querySelector(".autocomplete");
root.innerHTML = `
  <label><b>Search for a Movie</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = async (e) => {
  const movies = await fetchData(e.target.value);

  resultsWrapper.innerHTML = "";
  dropdown.classList.add("is-active");

  //! Show the dropdown on focus and when movies array not empty
  input.addEventListener("focus", () => {
    if (input.value !== "" && movies.length > 0) {
      dropdown.classList.add("is-active");
    }
  });

  // console.log(typeof movies);

  //! Close dropdown when movie array empty or wrong value entered
  if (!movies) {
    dropdown.classList.remove("is-active");
    return;
  }
  if (!movies[0]) {
    dropdown.classList.remove("is-active");
  }

  movies.forEach((movie) => {
    //! Create and add to html movie links (image and title)
    const option = document.createElement("a");
    const imgPosterPath = movie.poster_path;
    let imgSrc;

    if (imgPosterPath === null) {
      imgSrc = "";
    } else {
      imgSrc = `https://image.tmdb.org/t/p/w300${imgPosterPath}`;
    }
    option.classList.add("dropdown-item");
    option.innerHTML = `
    <img src="${imgSrc}">
    ${movie.original_title}
    `;
    resultsWrapper.appendChild(option);

    //! Set input text to the movie you clicked
    option.addEventListener("mouseover", () => {
      input.value = movie.original_title;
      // dropdown.classList.remove("is-active");
    });

    //! Close the dropdown and display information about the movie you clicked
  });
};

input.addEventListener("input", debounce(onInput));

//! Close dropdown when clicking outside of it
document.addEventListener("click", (e) => {
  if (!root.contains(e.target)) {
    dropdown.classList.remove("is-active");
  }
});
