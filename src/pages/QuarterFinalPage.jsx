import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "../authContext/auth.context";
import UpdateQuarterFinals from "../components/UpdateQuarterFinals";
import RealResult from "../components/RealResult";
import GameItem from "../components/GameItem";
import "../Css/RoundOf16.css";

function QuarterFinalPage() {
  const [games, setGames] = useState([]);
  const [confirmed, setConfirmed] = useState([]);
  const [selectedOutcome, setSelectedOutcome] = useState([]);
  const [team1Scores, setTeam1Scores] = useState([]);
  const [team2Scores, setTeam2Scores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentGameIndex, setCurrentGameIndex] = useState(null);
  const { user } = useContext(AuthContext); // Get user context

  const isAdmin = user && user.role === "admin"; // Check if the user is an admin

  const fetchQuarterFinalGames = async () => {
    try {
      const response = await axios.get(`${API_URL}/knockout/quarterfinalgames`);
      if (response.data && response.data.length > 0) {
        const sortedGames = response.data.sort((a, b) =>
          a.id.localeCompare(b.id)
        );
        setGames(sortedGames);
        setConfirmed(Array(sortedGames.length).fill(false));
        setSelectedOutcome(Array(sortedGames.length).fill(null));
        setTeam1Scores(Array(sortedGames.length).fill(0));
        setTeam2Scores(Array(sortedGames.length).fill(0));

        // Fetch user predictions
        const token = localStorage.getItem("jwtToken");
        const predictionsResponse = await axios.get(`${API_URL}/predictions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userPredictions = predictionsResponse.data;
        const newConfirmed = sortedGames.map((game) =>
          userPredictions.some((prediction) => prediction.gameId === game.id)
        );
        setConfirmed(newConfirmed);
      }
    } catch (error) {
      console.error("Error fetching quarter-final games:", error);
    }
  };

  useEffect(() => {
    fetchQuarterFinalGames();
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
      fetchQuarterFinalGames();
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

  return (
    <div className="quarter-final-container">
      <h2>Quarter-Final Games</h2>
      {isAdmin && <UpdateQuarterFinals onUpdate={fetchQuarterFinalGames} />}
      {games.map((game, index) => (
        <div key={index}>
          <GameItem
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
          {isAdmin && <RealResult game={game} index={index} />}
        </div>
      ))}
      <Link to="/predictions" className="back-button">
        Back to Predictions
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

export default QuarterFinalPage;
