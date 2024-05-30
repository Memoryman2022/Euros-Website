import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../authContext/auth.context";
import { API_URL } from "../config";
import { groupStageGames } from "../gamesData";
import GameItem from "../components/GameItem"; // Import the new component
import "../Css/GroupDetails.css";

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
      <h3>
        Important Notice: <br />
        <br />
        Submission Deadline: Predictions must be submitted at least 1 hour
        before kick-off. <br /> <br />
        Time Zone Information: All game times are in Central European Standard
        Time (CEST). <br />
        <br />
        UK Players: Please be aware of the time difference.{" "}
      </h3>
      {groupGames.map((game, index) => (
        <GameItem
          key={index}
          game={game}
          index={index}
          confirmed={confirmed[index]}
          selectedOutcome={selectedOutcome[index]}
          team1Scores={team1Scores[index]}
          team2Scores={team2Scores[index]}
          onScoreChange={handleScoreChange}
          onCheckboxChange={handleCheckboxChange}
          onShowModal={handleConfirm}
        />
      ))}
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
