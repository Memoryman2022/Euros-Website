import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "../Css/ConfirmedPredictions.css";

const ConfirmedPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [realResults, setRealResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight
  );
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 600);

  const fetchPredictions = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    try {
      const [predictionsResponse, realResultsResponse] = await Promise.all([
        axios.get(`${API_URL}/predictions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/realresults`),
      ]);

      const sortedPredictions = predictionsResponse.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setPredictions(sortedPredictions);
      setRealResults(realResultsResponse.data);
    } catch (error) {
      setError("Failed to fetch data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();

    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
      setIsSmallScreen(window.innerWidth <= 600);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getRealResult = (gameId) => {
    const result = realResults.find((result) => result.gameId === gameId);
    return result ? `${result.team1Score} - ${result.team2Score}` : "N/A";
  };

  const calculatePoints = (prediction) => {
    const realResult = realResults.find(
      (result) => result.gameId === prediction.gameId
    );
    if (!realResult) return "N/A";

    let points = 0;

    // Correct score prediction
    if (
      prediction.team1Score === realResult.team1Score &&
      prediction.team2Score === realResult.team2Score
    ) {
      points += 5;
    }

    // Correct outcome prediction
    const predictedOutcome =
      prediction.team1Score > prediction.team2Score
        ? "team1 win"
        : prediction.team1Score < prediction.team2Score
        ? "team2 win"
        : "draw";

    if (predictedOutcome === realResult.outcome) {
      points += 2;
    }

    return points;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      {isSmallScreen && !isLandscape && (
        <div className="orientation-prompt">
          Please rotate your device to landscape view to see the predictions.
        </div>
      )}
      <div
        className={`confirmed-predictions-container ${
          isSmallScreen && !isLandscape ? "hide" : ""
        }`}
      >
        <h4>Confirmed Predictions</h4>
        <div className="confirmed-predictions-grid">
          <div className="confirmed-grid-header">Date</div>
          <div className="confirmed-grid-header">Team1</div>
          <div className="confirmed-grid-header">Score</div>
          <div className="confirmed-grid-header">Team2</div>
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
                {getRealResult(prediction.gameId)}
              </div>
              <div className="confirmed-grid-item">
                {calculatePoints(prediction)}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default ConfirmedPredictions;
