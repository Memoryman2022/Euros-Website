import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import getFlagUrl from "../utils/getFlagUrl";
import "../Css/FinalPredictions.css";

const FinalPredictions = () => {
  const [groupedPredictions, setGroupedPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFinalPredictions = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/predictions/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroupedPredictions(response.data);
    } catch (error) {
      setError("Failed to fetch final predictions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinalPredictions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="final-predictions-container">
      <h4>Final Predictions</h4>
      {Object.keys(groupedPredictions).map((gameId) => {
        const game = groupedPredictions[gameId][0];
        return (
          <div key={gameId} className="game-predictions">
            <h5>
              <img
                src={getFlagUrl(game.team1)}
                alt={game.team1}
                className="flag-icon"
              />{" "}
              {game.team1} vs {game.team2}{" "}
              <img
                src={getFlagUrl(game.team2)}
                alt={game.team2}
                className="flag-icon"
              />
            </h5>
            <div className="predictions-grid">
              <div className="grid-header">User</div>
              <div className="grid-header">Date</div>
              <div className="grid-header">Team 1</div>
              <div className="grid-header">Score</div>
              <div className="grid-header">Team 2</div>
              <div className="grid-header">Outcome</div>
              {groupedPredictions[gameId].map((prediction) => (
                <React.Fragment key={prediction._id}>
                  <div className="grid-item">{prediction.userId.userName}</div>
                  <div className="grid-item">{prediction.date}</div>
                  <div className="grid-item">{prediction.team1}</div>
                  <div className="grid-item">
                    {prediction.team1Score} - {prediction.team2Score}
                  </div>
                  <div className="grid-item">{prediction.team2}</div>
                  <div className="grid-item">
                    {prediction.predictedOutcome === "team1"
                      ? prediction.team1
                      : prediction.predictedOutcome === "team2"
                      ? prediction.team2
                      : "Draw"}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FinalPredictions;
