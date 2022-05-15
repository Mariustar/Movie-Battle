const fetchData = async () => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "5a0bac7d",
      i: "tt3609458",
    },
  });
  console.log(response.data);
};
