import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext/auth.context";
import "../Css/AuthStyles.css"; // Import the unified CSS file

const Logout = () => {
  const { logOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // This function is triggered by the button click
  const handleLogout = () => {
    logOutUser(); // Call the logout function from context to remove token and clear session
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className="logout-container">
      <div className="logout-div">
        <h4>Confirm log out?</h4>
        <button className="auth-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Logout;
