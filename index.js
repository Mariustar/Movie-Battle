// const { default: axios } = require("axios");

const API_KEY = "37f0afe1ca89fac4c1d8f7b18798c757";
const BASE_URL = "https://api.themoviedb.org/3/movie/";
const IMG_URL = "https://image.tmdb.org/t/p/original";

const fetchData = async (searchResult) => {
  const page = 1;
  const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&page=${page}&query=${searchResult}&include_adult=true`;
  const response = await axios.get(SEARCH_URL);
  console.log(response.data);
};

const input = document.querySelector("input");
let timeoutID;
const onInput = (e) => {
  if (timeoutID) {
    clearTimeout(timeoutID);
  }
  timeoutID = setTimeout(() => {
    fetchData(e.target.value);
  }, 1000);
};
input.addEventListener("input", onInput);
