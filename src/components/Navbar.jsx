import React, { useContext } from "react";
import { Link } from "react-router-dom";

import "../Css/Navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src="/Euro_logo.png" alt="Euro Sweepstake Logo" />
      </div>

      <ul className="navbar-menu">
        <li className="menu-list-item">
          <Link to="/">Home</Link>
        </li>
        <li className="menu-list-item">
          <Link to="/predictions">Predictions</Link>
        </li>
        <li className="menu-list-item">
          <Link to="/leaderboard">Leaderboard</Link>
        </li>
        <li className="menu-list-item">
          {" "}
          <Link to="/userlist">Userlist</Link>
        </li>
      </ul>
    </div>
  );
}
export default Navbar;
