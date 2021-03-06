"use strict";

export const debounce = (func, delay = 450) => {
  let timeoutID;
  return (...args) => {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export { debounce as utils };
