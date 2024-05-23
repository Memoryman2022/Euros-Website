import React from "react";
import { Link } from "react-router-dom";
import "../Css/NotFound.css";

function NotFoundPage() {
  return (
    <div className="not-found-container">
      <div className="not-found-div">404 - Not Found</div>
      <div className="not-found-links">
        <Link to="/user/:userId" className="nfLink">
          HOME
        </Link>
        <Link to="/predictions" className="nfLink">
          PREDICTIONS
        </Link>
        <Link to="/leaderboard" className="nfLink">
          LEADERBOARD
        </Link>
        <Link to="/logout" className="nfLink">
          LOGOUT
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
