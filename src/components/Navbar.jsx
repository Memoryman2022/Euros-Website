import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../authContext/auth.context";
import "../Css/Navbar.css";

function Navbar() {
  const [menuActive, setMenuActive] = useState(false);
  const { isLoggedIn, user } = useContext(AuthContext);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src="/Euro_logo.png" alt="Euro Sweepstake Logo" />
      </div>

      <div className="burger-menu" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <ul className={`navbar-menu ${menuActive ? "active" : ""}`}>
        {isLoggedIn ? (
          <>
            <li className="menu-list-item">
              <Link to={user ? `/user/${user._id}` : "/"} onClick={toggleMenu}>
                Home
              </Link>
            </li>
            <li className="menu-list-item">
              <Link to="/predictions" onClick={toggleMenu}>
                Predictions
              </Link>
            </li>
            <li className="menu-list-item">
              <Link to="/final-predictions" onClick={toggleMenu}>
                Final Predictions
              </Link>
            </li>
            <li className="menu-list-item">
              <Link to="/leaderboard" onClick={toggleMenu}>
                Leaderboard
              </Link>
            </li>
            <li className="menu-list-item">
              <Link to="/logout" onClick={toggleMenu}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="menu-list-item">
              <Link to="/login" onClick={toggleMenu}>
                Login
              </Link>
            </li>
            <li className="menu-list-item">
              <Link to="/register" onClick={toggleMenu}>
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
