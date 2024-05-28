// src/socket.js
import { io } from "socket.io-client";
import { API_URL } from "../config/index";

const socket = io(API_URL.replace("/api", ""), {
  transports: ["websocket", "polling"], // Ensure both transports are allowed
  withCredentials: true, // Include credentials for CORS
});

export default socket;
