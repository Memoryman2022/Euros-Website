import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import getFlagUrl from "../utils/getFlagUrl";
import "../Css/FinalPredictions.css";

const FinalPredictions = () => {
  const [groupedPredictions, setGroupedPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight
  );
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 500);

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

      setGroupedPredictions(response.data || []);
    } catch (error) {
      setError("Failed to fetch final predictions");
      console.error("Fetch Final Predictions Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinalPredictions();

    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
      setIsSmallScreen(window.innerWidth <= 500);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (isSmallScreen && !isLandscape) {
    return (
      <div className="orientation-prompt">
        Please switch to landscape mode for a better experience.
      </div>
    );
  }

  return (
    <div className="final-predictions-container">
      <h4>Final Predictions</h4>
      <div>
        Predictions will be revealed one hour before the match OR when all users
        have submitted their predictions for a given match.
      </div>
      {Array.isArray(groupedPredictions) && groupedPredictions.length > 0 ? (
        groupedPredictions.map((game) => (
          <div key={game.gameId} className="game-predictions">
            <h3>
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
            </h3>
            {game.revealPredictions ? (
              <div className="predictions-grid">
                <div className="grid-header">User</div>
                <div className="grid-header">Date</div>
                <div className="grid-header">Team 1</div>
                <div className="grid-header">Score</div>
                <div className="grid-header">Team 2</div>
                <div className="grid-header">Outcome</div>
                {game.predictions.map((prediction) => (
                  <React.Fragment key={prediction._id}>
                    <div className="grid-item">
                      {prediction.userId.userName}
                    </div>
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
            ) : (
              <div>
                Predictions will be revealed one hour before the match or when
                all users have submitted their predictions.
              </div>
            )}
          </div>
        ))
      ) : (
        <div>No predictions available.</div>
      )}
    </div>
  );
};

export default FinalPredictions;
