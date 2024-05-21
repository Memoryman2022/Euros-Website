import React from "react";
import { useNavigate } from "react-router-dom";

//css
import "../Css/Landing.css";
const Landing = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login"); // Navigate to Login page
  };

  const handleRegister = () => {
    navigate("/register"); // Navigate to Register page
  };

  return (
    <div className="landing-container">
      <h4>Welcome!</h4>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Landing;
