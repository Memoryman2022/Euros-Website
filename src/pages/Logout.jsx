import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext/auth.context";

import "../Css/Logout.css";

const Logout = () => {
  const { logOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // This function is triggered by the button click
  const handleLogout = () => {
    logOutUser(); // Call the logout function from context to remove token and clear session
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className="logout-wrapper">
      <div className="logout-container">
        <div className="logout-div">
          <h4>Confirm log out?</h4>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
