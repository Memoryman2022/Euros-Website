import React from "react";
import { useNavigate } from "react-router-dom";

//css
import "../Css/AuthStyles.css";
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
      <div className="landing-div">
        <h4>Welcome to the Euro 2024 sweepstake.</h4>

        <button className="landing-btn" onClick={handleLogin}>
          Login
        </button>
        <button className="landing-btn" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Landing;
