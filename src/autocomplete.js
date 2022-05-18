"use strict";

//! CREATE THE AUTOCOMPLETE DROPDOWN
const createAutocomplete = ({ root }) => {
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

  // document.addEventListener("click", (e) => {
  //   if (!root.contains(e.target))) {
  //     dropdown.classList.remove("is-active");
  //   };
  // })

  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};

export { createAutocomplete as autoComplete };
