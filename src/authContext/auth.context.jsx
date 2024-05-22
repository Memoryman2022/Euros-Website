import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  // Store token in localStorage
  const storeToken = (token) => {
    localStorage.setItem("jwtToken", token);
  };

  // Store userId in localStorage
  const storeUserId = (userId) => {
    localStorage.setItem("userId", userId);
  };

  // Remove token from localStorage
  const removeToken = () => {
    localStorage.removeItem("jwtToken");
  };

  // Remove userId from localStorage
  const removeUserId = () => {
    localStorage.removeItem("userId");
  };

  const refreshToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/refresh`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      });
      const { token } = response.data;
      storeToken(token);
      await authenticateUser();
    } catch (error) {
      console.error("Error refreshing token:", error);
      logOutUser();
    }
  };

  // Authenticate user and load user information from localStorage if available
  const authenticateUser = async () => {
    const storedToken = localStorage.getItem("jwtToken");
    if (!storedToken) {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setIsLoggedIn(true);
      setUser(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        await refreshToken();
      } else {
        setAuthError(error.response?.data.message || "Failed to authenticate");
        setIsLoggedIn(false);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    setAuthError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      console.log("Response from login:", response.data);
      const { token, userId, user } = response.data; // Ensure response contains token, userId, and user
      if (token && userId && user) {
        storeToken(token);
        storeUserId(userId);
        setUser(user);
        setIsLoggedIn(true);
        navigate(`/user/${userId}`);
      } else {
        setAuthError("No token or userId received");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setAuthError(error.response?.data.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Updated registerUser function to handle FormData
  const registerUser = async (userName, email, password, profileImage) => {
    setAuthError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("email", email);
      formData.append("password", password);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await axios.post(`${API_URL}/auth/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response from registration:", response.data);
      const { token, createdUser } = response.data; // Ensure response contains token, userId, and user
      if (token && createdUser._id) {
        storeToken(token);
        storeUserId(createdUser._id);
        setUser(createdUser);
        setIsLoggedIn(true);
        navigate(`/user/${createdUser._id}`);
        await authenticateUser(); // Optional, ensure user data is up-to-date
      } else {
        setAuthError("No token or userId received");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setAuthError(error.response?.data.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logOutUser = () => {
    removeToken();
    removeUserId();
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login"); // Navigate to login page on logout
  };

  useEffect(() => {
    authenticateUser(); // Authenticate user on mount
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        storeUserId,
        authenticateUser,
        logOutUser,
        loginUser,
        registerUser,
        authError,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };
