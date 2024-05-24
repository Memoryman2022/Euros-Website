// src/config.js

const API_URL =
  window.location.hostname === "localhost"
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_IP_URL;

console.log("API_URL:", API_URL);

export { API_URL };
