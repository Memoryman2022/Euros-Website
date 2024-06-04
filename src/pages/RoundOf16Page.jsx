import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import getFlagUrl from "../utils/getFlagUrl";
import { API_URL } from "../config";
import { AuthContext } from "../authContext/auth.context";
import UpdateRoundOf16 from "../components/UpdateRoundOf16";
import RealResult from "../components/RealResult";
import "../Css/RoundOf16.css";

function RoundOf16Page() {
  const [games, setGames] = useState([]);
  const [confirmed, setConfirmed] = useState([]);
  const [selectedOutcome, setSelectedOutcome] = useState([]);
  const [team1Scores, setTeam1Scores] = useState([]);
  const [team2Scores, setTeam2Scores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentGameIndex, setCurrentGameIndex] = useState(null);
  const { user } = useContext(AuthContext); // Get user context

  const isAdmin = user && user.role === "admin"; // Check if the user is an admin

  useEffect(() => {
    const fetchRoundOf16Games = async () => {
      try {
        const response = await axios.get(`${API_URL}/roundof16`);
        if (response.data && response.data.length > 0) {
          setGames(response.data);
          setConfirmed(Array(response.data.length).fill(false));
          setSelectedOutcome(Array(response.data.length).fill(null));
          setTeam1Scores(Array(response.data.length).fill(0));
          setTeam2Scores(Array(response.data.length).fill(0));
        }
      } catch (error) {
        console.error("Error fetching Round of 16 games:", error);
      }
    };

    fetchRoundOf16Games();
  }, []);

  const handleConfirm = (index) => {
    setCurrentGameIndex(index);
    setShowModal(true);
  };

  const handleModalConfirm = async () => {
    const newConfirmed = [...confirmed];
    newConfirmed[currentGameIndex] = true;
    setConfirmed(newConfirmed);
    setShowModal(false);

    // Send prediction to backend
    try {
      const token = localStorage.getItem("jwtToken");
      const predictionData = {
        gameId: games[currentGameIndex].id, // Unique game ID
        date: games[currentGameIndex].date,
        team1: games[currentGameIndex].team1,
        team2: games[currentGameIndex].team2,
        team1Score: team1Scores[currentGameIndex],
        team2Score: team2Scores[currentGameIndex],
        predictedOutcome: selectedOutcome[currentGameIndex],
      };

      console.log("Sending prediction data:", predictionData);

      const response = await axios.post(
        `${API_URL}/predictions`,
        predictionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Prediction saved:", response.data);
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
      } else {
        console.error("Error saving prediction:", error.message);
      }
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const handleCheckboxChange = (gameIndex, outcome) => {
    const newSelectedOutcome = [...selectedOutcome];
    newSelectedOutcome[gameIndex] = outcome;
    setSelectedOutcome(newSelectedOutcome);
  };

  const handleScoreChange = (gameIndex, team, value) => {
    if (team === "team1") {
      const newScores = [...team1Scores];
      newScores[gameIndex] = value;
      setTeam1Scores(newScores);
    } else {
      const newScores = [...team2Scores];
      newScores[gameIndex] = value;
      setTeam2Scores(newScores);
    }
  };

  const renderScoreOptions = () => {
    const options = [];
    for (let i = 0; i <= 10; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  return (
    <div className="round-of-16-container">
      <h2>Round of 16 Games</h2>
      {games.map((game, index) => (
        <div key={index} className="game-item">
          <div className="game-row">
            <div className="game-date">{game.date}</div>
            <div className="team-container">
              <span className="team-name">
                <img
                  src={
                    game.team1.includes("1") ||
                    game.team1.includes("2") ||
                    game.team1.includes("3")
                      ? "/euro_fix.png"
                      : getFlagUrl(game.team1)
                  }
                  alt={game.team1}
                  className="flag-icon"
                  onError={(e) => {
                    e.target.onerror = null; // prevents looping
                    e.target.src = "/euro_fix.png";
                  }}
                />
                {game.team1}
              </span>
              <select
                className="score-select"
                disabled={confirmed[index]}
                value={team1Scores[index]}
                onChange={(e) =>
                  handleScoreChange(index, "team1", parseInt(e.target.value))
                }
              >
                {renderScoreOptions()}
              </select>
            </div>
            <span className="versus">V</span>
            <div className="team-container">
              <select
                className="score-select"
                disabled={confirmed[index]}
                value={team2Scores[index]}
                onChange={(e) =>
                  handleScoreChange(index, "team2", parseInt(e.target.value))
                }
              >
                {renderScoreOptions()}
              </select>
              <span className="team-name">
                <img
                  src={
                    game.team2.includes("1") ||
                    game.team2.includes("2") ||
                    game.team2.includes("3")
                      ? "/euro_fix.png"
                      : getFlagUrl(game.team2)
                  }
                  alt={game.team2}
                  className="flag-icon"
                  onError={(e) => {
                    e.target.onerror = null; // prevents looping
                    e.target.src = "/euro_fix.png";
                  }}
                />
                {game.team2}
              </span>
            </div>
          </div>
          <div className="checkbox-container">
            <label>
              {game.team1} win
              <input
                type="checkbox"
                checked={selectedOutcome[index] === "team1"}
                onChange={() => handleCheckboxChange(index, "team1")}
                disabled={confirmed[index]}
              />
            </label>
            <label>
              Draw
              <input
                type="checkbox"
                checked={selectedOutcome[index] === "draw"}
                onChange={() => handleCheckboxChange(index, "draw")}
                disabled={confirmed[index]}
              />
            </label>
            <label>
              {game.team2} win
              <input
                type="checkbox"
                checked={selectedOutcome[index] === "team2"}
                onChange={() => handleCheckboxChange(index, "team2")}
                disabled={confirmed[index]}
              />
            </label>
          </div>
          <div className="confirm-button-container">
            <button
              className="confirm-button"
              onClick={() => handleConfirm(index)}
              disabled={confirmed[index]}
            >
              Confirm
            </button>
          </div>
          {isAdmin && <RealResult game={game} index={index} />}
        </div>
      ))}
      <Link to="/predictions" className="back-button">
        Back to Predictions
      </Link>

      {isAdmin && <UpdateRoundOf16 />}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Prediction?</h3>
            <p>
              Warning: Confirmation of each individual fixture prediction is
              final! This submission can not be edited.
            </p>
            <div className="modal-buttons">
              <button
                className="modal-button confirm"
                onClick={handleModalConfirm}
              >
                Confirm
              </button>
              <button
                className="modal-button cancel"
                onClick={handleModalCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoundOf16Page;
