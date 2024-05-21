import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext/auth.context";

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
      <h1>Confirm log out?</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
