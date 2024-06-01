import axios from "axios";
import { API_URL } from "./config";

// User API calls

export const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user", error);
    throw error;
  }
};

// Fetch Users
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};

// Update User Scores
export const updateUserScores = async (users) => {
  try {
    const token = localStorage.getItem("jwtToken");
    await axios.put(`${API_URL}/users/update-scores`, users, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error updating user scores", error);
    throw error;
  }
};

// Save User Movements
export const saveUserMovements = async (users) => {
  try {
    const token = localStorage.getItem("jwtToken");
    await axios.put(`${API_URL}/users/update-movements`, users, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error updating user movements", error);
    throw error;
  }
};

export const fetchUserDetails = async (userId, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/users/protected/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user details", error);
    throw error;
  }
};

// Predictions API calls

export const createPrediction = async (predictionData) => {
  const token = localStorage.getItem("jwtToken");
  try {
    const response = await axios.post(
      `${API_URL}/predictions`,
      predictionData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating prediction", error);
    throw error;
  }
};

export const fetchUserPredictions = async (userId) => {
  const token = localStorage.getItem("jwtToken");
  try {
    const response = await axios.get(`${API_URL}/predictions/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching predictions", error);
    throw error;
  }
};

// Messages API calls

export const fetchMessages = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching messages", error);
    throw error;
  }
};

export const createMessage = async (content, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/messages`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating message", error);
    throw error;
  }
};
