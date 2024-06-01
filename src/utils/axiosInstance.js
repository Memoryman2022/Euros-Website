// frontend/src/axiosInstance.js

import axios from "axios";

// Create an instance of axios
const axiosInstance = axios.create();

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 404) {
      // Log 404 errors as informational messages
      console.info(`Resource not found: ${error.config.url}`);
      // Return a resolved promise with null data to avoid propagating the error
      return { data: null };
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
