import axios from "axios";

const API_URL = "http://localhost:5005/api"; // Replace with your backend URL if different

export const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Register response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error registering user", error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};

export const updateUserScores = async (users) => {
  try {
    const response = await axios.put(`${API_URL}/users/update-scores`, {
      users,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user scores", error);
    throw error;
  }
};

export const fetchUserDetails = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/protected/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Fetched user details:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in user", error);
    throw error;
  }
};
