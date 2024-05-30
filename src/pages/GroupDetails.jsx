import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../authContext/auth.context";
import { API_URL } from "../config";
import { groupStageGames } from "../gamesData";
import getFlagUrl from "../utils/getFlagUrl";
import { parse, format, differenceInMilliseconds } from "date-fns";
import "../Css/GroupDetails.css";

const ONE_HOUR = 60 * 60 * 1000; // Define ONE_HOUR in milliseconds

function GroupDetails() {
  const { group } = useParams();
  const { user } = useContext(AuthContext); // Get user context
  const groupGames = groupStageGames[group];
  const [confirmed, setConfirmed] = useState(
    Array(groupGames.length).fill(false)
  );
  const [selectedOutcome, setSelectedOutcome] = useState(
    Array(groupGames.length).fill(null)
  );
  const [team1Scores, setTeam1Scores] = useState(
    Array(groupGames.length).fill(0)
  );
  const [team2Scores, setTeam2Scores] = useState(
    Array(groupGames.length).fill(0)
  );
  const [showModal, setShowModal] = useState(false);
  const [currentGameIndex, setCurrentGameIndex] = useState(null);
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight
  );
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 700);

  useEffect(() => {
    // Fetch existing predictions from backend on component mount
    const fetchPredictions = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(`${API_URL}/predictions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const predictions = response.data;

        const newConfirmed = [...confirmed];
        const newSelectedOutcome = [...selectedOutcome];
        const newTeam1Scores = [...team1Scores];
        const newTeam2Scores = [...team2Scores];

        predictions.forEach((prediction) => {
          const gameIndex = groupGames.findIndex(
            (game) => game.id === prediction.gameId
          );
          if (gameIndex > -1) {
            newConfirmed[gameIndex] = true;
            newSelectedOutcome[gameIndex] = prediction.predictedOutcome;
            newTeam1Scores[gameIndex] = prediction.team1Score;
            newTeam2Scores[gameIndex] = prediction.team2Score;
          }
        });

        setConfirmed(newConfirmed);
        setSelectedOutcome(newSelectedOutcome);
        setTeam1Scores(newTeam1Scores);
        setTeam2Scores(newTeam2Scores);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    };

    fetchPredictions();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
      setIsSmallScreen(window.innerWidth <= 700);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
      await axios.post(
        `${API_URL}/predictions`,
        {
          gameId: groupGames[currentGameIndex].id, // Unique game ID
          date: groupGames[currentGameIndex].date,
          team1: groupGames[currentGameIndex].team1,
          team2: groupGames[currentGameIndex].team2,
          team1Score: team1Scores[currentGameIndex],
          team2Score: team2Scores[currentGameIndex],
          predictedOutcome: selectedOutcome[currentGameIndex],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Prediction saved successfully");
    } catch (error) {
      console.error("Error saving prediction:", error);
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

  const isPredictionWindowExpired = (gameDate) => {
    const matchStartTime = parse(
      `${gameDate} ${new Date().getFullYear()}`,
      "dd MMM HH:mm yyyy",
      new Date()
    );
    const currentTime = new Date();
    console.log("Match Start Time:", matchStartTime);
    console.log("Current Time:", currentTime);
    console.log(
      "Time Difference (ms):",
      differenceInMilliseconds(matchStartTime, currentTime)
    );
    console.log(
      "Is Expired:",
      differenceInMilliseconds(matchStartTime, currentTime) <= ONE_HOUR
    );
    return differenceInMilliseconds(matchStartTime, currentTime) <= ONE_HOUR;
  };

  if (isSmallScreen && !isLandscape) {
    return (
      <div className="orientation-prompt">
        Please switch to landscape mode for a better experience.
      </div>
    );
  }

  return (
    <div className="group-details-container">
      <h2>{group}</h2>
      {groupGames.map((game, index) => {
        const isExpired = isPredictionWindowExpired(game.date);
        return (
          <div
            key={index}
            className={`game-item ${confirmed[index] ? "confirmed" : ""}`}
          >
            <div className="game-row">
              <div className="game-date">{game.date}</div>
              <div className="team-container">
                <span className="team-name">
                  <img
                    src={getFlagUrl(game.team1)}
                    alt={game.team1}
                    className="flag-icon"
                  />
                  {game.team1}
                </span>
                <select
                  className="score-select"
                  disabled={confirmed[index] || isExpired}
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
                  disabled={confirmed[index] || isExpired}
                  value={team2Scores[index]}
                  onChange={(e) =>
                    handleScoreChange(index, "team2", parseInt(e.target.value))
                  }
                >
                  {renderScoreOptions()}
                </select>
                <span className="team-name">
                  {game.team2}
                  <img
                    src={getFlagUrl(game.team2)}
                    alt={game.team2}
                    className="flag-icon"
                  />
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
                  disabled={confirmed[index] || isExpired}
                />
              </label>
              <label>
                Draw
                <input
                  type="checkbox"
                  checked={selectedOutcome[index] === "draw"}
                  onChange={() => handleCheckboxChange(index, "draw")}
                  disabled={confirmed[index] || isExpired}
                />
              </label>
              <label>
                {game.team2} win
                <input
                  type="checkbox"
                  checked={selectedOutcome[index] === "team2"}
                  onChange={() => handleCheckboxChange(index, "team2")}
                  disabled={confirmed[index] || isExpired}
                />
              </label>
            </div>
            <button
              className="confirm-button"
              onClick={() => handleConfirm(index)}
              disabled={confirmed[index] || isExpired}
            >
              Confirm
            </button>
            {isExpired && !confirmed[index] && (
              <div className="expired-message">
                The prediction window has expired for this match.
              </div>
            )}
          </div>
        );
      })}
      <Link to="/predictions" className="back-button">
        Back to Groups
      </Link>

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

export default GroupDetails;
