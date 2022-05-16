// const API_KEY = "37f0afe1ca89fac4c1d8f7b18798c757";
// const BASE_URL = "https://api.themoviedb.org/3/movie/";
// const IMG_URL = "https://image.tmdb.org/t/p/original";

const fetchData = async (searchTerm) => {
  const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
    params: {
      api_key: "37f0afe1ca89fac4c1d8f7b18798c757",
      query: searchTerm,
      include_adult: false,
    },
  });

  // if (response.status === 404) {
  //   return [];
  // }
  // console.log(response.status);

  return response.data.results;
};

const input = document.querySelector("input");

const onInput = async (e) => {
  const movies = await fetchData(e.target.value);
  movies.forEach((movie) => {
    const div = document.createElement("div");
    div.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" class="smaller">
    <h1>${movie.original_title}</h1>
    `;
    document.querySelector("#target").appendChild(div);
  });
  if (movies.length === 0) {
    alert("Nothing here");
  }
};

input.addEventListener("input", debounce(onInput));
