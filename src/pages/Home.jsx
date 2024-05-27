// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import MessageFunction from "../components/MessageFunction";
import Leaderboard from "../pages/Leaderboard";
import ConfirmedPredictions from "../components/ConfirmedPredictions";
import Tabs from "../components/Tabs";
import "../Css/Home.css";
import { fetchUserDetails } from "../api";
import { API_URL } from "../config/index";

function Home() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAndSetUserDetails = async () => {
    const token = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      setLoading(true);
      try {
        const data = await fetchUserDetails(userId, token);
        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAndSetUserDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const tabs = [
    { label: "Confirmed Predictions", content: <ConfirmedPredictions /> },
    { label: "Leaderboard", content: <Leaderboard /> },
  ];

  return (
    <div className="home-container">
      <div className="main-content-home">
        <div className="user-details">
          <div className="profile-pic-home">
            {userDetails && (
              <img
                src={`${API_URL.replace("/api", "")}${
                  userDetails.profileImage
                }`}
                alt="Profile"
              />
            )}
          </div>
          <div className="user-info">
            <div className="user-info-item">
              <span className="label">Name:</span>
              <span className="value">
                {userDetails ? userDetails.userName : "Loading..."}
              </span>
            </div>
            <div className="user-info-item">
              <span className="label">Score:</span>
              <span className="value">
                {userDetails ? userDetails.score : "Loading..."}
              </span>
            </div>
            <div className="user-info-item">
              <span className="label">Position:</span>
              <span className="value">
                {userDetails ? userDetails.position : "Loading..."}
              </span>
            </div>
          </div>
        </div>
        <MessageFunction userDetails={userDetails} />
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
}

export default Home;
