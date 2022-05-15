const API_KEY = "37f0afe1ca89fac4c1d8f7b18798c757";
const BASE_URL = "https://api.themoviedb.org/3/movie/";
const IMG_URL = "https://image.tmdb.org/t/p/original";

const fetchData = async (searchResult) => {
  const FULL_URL = `${BASE_URL}${document.querySelector("input").value}?api_key=${API_KEY}`;
  const response = await axios.get(FULL_URL);
  console.log(response.data);
};

const input = document.querySelector("input");
input.addEventListener("input", (e) => {
  fetchData(e.target.value);
});
