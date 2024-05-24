// src/utils/getProfileImageUrl.js
import { API_URL } from "../config";

export const getProfileImageUrl = (profileImagePath) => {
  return `${API_URL.replace("/api", "")}${profileImagePath}`;
};
