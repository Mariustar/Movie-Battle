"use strict";
import { debounce } from "./utils";

//! CREATE THE AUTOCOMPLETE DROPDOWN
const createAutocomplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
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
    const itemList = await fetchData(e.target.value);
    resultsWrapper.innerHTML = "";
    dropdown.classList.add("is-active");

    if (itemList) {
      itemList.forEach((item) => {
        //! Create and add html dropdown-items (image and title)
        const option = document.createElement("a");
        option.classList.add("dropdown-item");
        option.innerHTML = renderOption(item);
        resultsWrapper.appendChild(option);

        //! Set input text to the text of the item you clicked
        option.addEventListener("mouseup", () => {
          input.value = inputValue(item);
          onOptionSelect(item);
          dropdown.classList.remove("is-active");
        });
      });
    }

    //! Close dropdown when itemList empty or wrong value entered
    if (!itemList) {
      dropdown.classList.remove("is-active");
      return;
    }
    if (!itemList[0]) {
      dropdown.classList.remove("is-active");
    }

    //! Show or hide dropdown on focus
    input.addEventListener("focus", () => {
      if (input.value !== "" && itemList.length > 0) {
        dropdown.classList.add("is-active");
      } else if (!itemList || !itemList[0]) {
        dropdown.classList.remove("is-active");
      }
    });
  };

  input.addEventListener("input", debounce(onInput));

  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};

export { createAutocomplete as autoComplete };
