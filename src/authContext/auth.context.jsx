import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Store token in localStorage
  const storeToken = (token) => {
    localStorage.setItem("jwtToken", token);
  };

  // Store userId in localStorage
  const storeUserId = (userId) => {
    localStorage.setItem("userId", userId);
  };

  // Store user information in localStorage
  const storeUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  };

  // Remove token from localStorage
  const removeToken = () => {
    localStorage.removeItem("jwtToken");
  };

  // Remove userId from localStorage
  const removeUserId = () => {
    localStorage.removeItem("userId");
  };

  // Remove user information from localStorage
  const removeUser = () => {
    localStorage.removeItem("user");
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
    const storedUser = localStorage.getItem("user");
    if (!storedToken) {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Use user information from localStorage
      setIsLoggedIn(true);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setIsLoggedIn(true);
        setUser(response.data);
        storeUser(response.data); // Store user information in localStorage
        storeUserId(response.data._id); // Assuming response.data contains the user object
      } catch (error) {
        if (error.response?.status === 401) {
          await refreshToken();
        } else {
          setAuthError(
            error.response?.data.message || "Failed to authenticate"
          );
          setIsLoggedIn(false);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
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
        storeUser(user); // Store user information in localStorage
        setUser(user);
        setIsLoggedIn(true);
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

  const registerUser = async (userName, email, password) => {
    setAuthError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        userName,
        email,
        password,
      });
      console.log("Response from registration:", response.data);
      const { token, userId, user } = response.data; // Ensure response contains token, userId, and user
      if (token && userId && user) {
        storeToken(token);
        storeUserId(userId);
        storeUser(user); // Store user information in localStorage
        setUser(user);
        await authenticateUser();
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
    removeUser(); // Remove user information from localStorage
    setIsLoggedIn(false);
    setUser(null);
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
