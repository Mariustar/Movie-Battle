const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "5a0bac7d",
      s: searchTerm,
    },
  });
  console.log(response.data);
};

const input = document.querySelector("input");
input.addEventListener("input", (e) => {
  fetchData(e.target.value);
});
