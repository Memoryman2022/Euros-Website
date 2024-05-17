import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../Css/Navbar.css";

function Navbar() {
  const [menuActive, setMenuActive] = useState(false);

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
        <li className="menu-list-item">
          <Link to="/" onClick={toggleMenu}>
            Home
          </Link>
        </li>
        <li className="menu-list-item">
          <Link to="/predictions" onClick={toggleMenu}>
            Predictions
          </Link>
        </li>
        <li className="menu-list-item">
          <Link to="/leaderboard" onClick={toggleMenu}>
            Leaderboard
          </Link>
        </li>
        <li className="menu-list-item">
          <Link to="/userlist" onClick={toggleMenu}>
            Userlist
          </Link>
        </li>
      </ul>
    </div>
  );
}
export default Navbar;
