// src/pages/Register.jsx
import React, { useState } from "react";
import { fetchUsers, registerUser } from "../api";
import { useNavigate } from "react-router-dom";

import "../Css/Register.css";

function Register() {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      await registerUser(formData);
      setMessage("Registration successful!");
      setUsername("");
      setEmail("");
      setPassword("");
      setProfileImage(null);

      const users = await fetchUsers();

      navigate("/");
    } catch (error) {
      setMessage("Registration failed. Please try again.");
      console.error("Error registering user:", error);
    }
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={userName}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Profile Image:</label>
          <input type="file" onChange={handleImageChange} />
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
