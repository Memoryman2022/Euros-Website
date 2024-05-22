import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../authContext/auth.context";
import { API_URL } from "../config";

import "../Css/ConfirmedPredictions.css";

const ConfirmedPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPredictions = async () => {
    const userId = localStorage.getItem("userId"); // Ensure the userId is correctly stored
    const token = localStorage.getItem("jwtToken");
    if (!userId || !token) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/users/${userId}/predictions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPredictions(response.data);
    } catch (error) {
      setError("Failed to fetch predictions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="confirmed-predictions-container">
      <h2>Confirmed Predictions</h2>
      <div className="predictions-grid">
        <div className="grid-header">Date</div>
        <div className="grid-header">Team 1</div>
        <div className="grid-header">Score</div>
        <div className="grid-header">Team 2</div>
        <div className="grid-header">W/L/D</div>
        <div className="grid-header">Real Score</div>
        <div className="grid-header">Points</div>
        {predictions.map((prediction) => (
          <>
            <div className="grid-item">{prediction.date}</div>
            <div className="grid-item">{prediction.team1}</div>
            <div className="grid-item">
              {prediction.team1Score} - {prediction.team2Score}
            </div>
            <div className="grid-item">{prediction.team2}</div>
            <div className="grid-item">{prediction.predictedOutcome}</div>
            <div className="grid-item">
              {prediction.realTeam1Score !== undefined &&
              prediction.realTeam2Score !== undefined
                ? `${prediction.realTeam1Score} - ${prediction.realTeam2Score}`
                : "N/A"}
            </div>
            <div className="grid-item">
              {prediction.points !== undefined ? prediction.points : "N/A"}
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default ConfirmedPredictions;
