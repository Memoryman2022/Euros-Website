// /config/index.js

const API_URL =
  window.location.hostname === "localhost"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL;

console.log("API_URL:", API_URL);

export { API_URL };
