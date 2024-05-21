import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  const storeToken = (token) => {
    localStorage.setItem("jwtToken", token);
  };

  const removeToken = () => {
    console.log("Removing token from storage");
    localStorage.removeItem("jwtToken");
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
      console.log("Error refreshing token:", error);
      logOutUser();
    }
  };

  // Authenticate User
  const authenticateUser = async () => {
    const storedToken = localStorage.getItem("jwtToken");
    if (!storedToken) {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setIsLoggedIn(true);
      setIsLoading(false);
      setUser(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        await refreshToken();
      } else {
        setAuthError(error.response?.data.message || "Failed to authenticate");
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
      }
    }
  };

  // Login User
  const loginUser = async (email, password) => {
    setAuthError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const token = response.data.token;
      if (token) {
        storeToken(token);
        console.log("Logging in, token stored");
        await authenticateUser();
      } else {
        setAuthError("No token received");
      }
    } catch (error) {
      setAuthError(error.response?.data.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Register User
  const registerUser = async (userName, email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/registration`, {
        userName,
        email,
        password,
      });
      const { token } = response.data;
      if (token) {
        storeToken(token);
        console.log("reg and token stored");
        await authenticateUser();
      } else {
        setAuthError("no token recieved");
      }
      // await loginUser(email, password); //log in after registration
    } catch (error) {
      setAuthError(error.response?.data.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout User
  const logOutUser = () => {
    removeToken();
    console.log("Logging out, token removed");
    setIsLoggedIn(false);
    setIsLoading(false);
    setUser(null);
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
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
