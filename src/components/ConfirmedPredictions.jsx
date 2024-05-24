import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "../Css/ConfirmedPredictions.css";

const ConfirmedPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPredictions = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/predictions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sortedPredictions = response.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setPredictions(sortedPredictions);
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
      <h4>Confirmed Predictions</h4>
      <div className="confirmed-predictions-grid">
        <div className="confirmed-grid-header">Date</div>
        <div className="confirmed-grid-header">Team 1</div>
        <div className="confirmed-grid-header">Score</div>
        <div className="confirmed-grid-header">Team 2</div>
        <div className="confirmed-grid-header">W/L/D</div>
        <div className="confirmed-grid-header">Verified</div>
        <div className="confirmed-grid-header">Points</div>
        {predictions.map((prediction) => (
          <React.Fragment key={prediction._id}>
            <div className="confirmed-grid-item">{prediction.date}</div>
            <div className="confirmed-grid-item">{prediction.team1}</div>
            <div className="confirmed-grid-item">
              {prediction.team1Score} - {prediction.team2Score}
            </div>
            <div className="confirmed-grid-item">{prediction.team2}</div>
            <div className="confirmed-grid-item">
              {prediction.predictedOutcome}
            </div>
            <div className="confirmed-grid-item">
              {prediction.realTeam1Score !== undefined &&
              prediction.realTeam2Score !== undefined
                ? `${prediction.realTeam1Score} - ${prediction.realTeam2Score}`
                : "N/A"}
            </div>
            <div className="confirmed-grid-item">
              {prediction.points !== undefined ? prediction.points : "N/A"}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ConfirmedPredictions;
