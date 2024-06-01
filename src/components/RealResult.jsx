import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstance"; // Import the custom axios instance
import { AuthContext } from "../authContext/auth.context";
import { API_URL } from "../config";
import "../Css/RealResult.css";

function RealResult({ game, index }) {
  // Add index as a prop
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin"; // Check if the user is an admin
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [outcome, setOutcome] = useState("");

  const fetchRealResult = async () => {
    console.info(`Fetching real result for game ${game.id} (index ${index})`);
    try {
      const response = await axiosInstance.get(
        `${API_URL}/realresults/${game.id}/result`
      );
      if (response.data) {
        const realResult = response.data;
        setTeam1Score(realResult.team1Score);
        setTeam2Score(realResult.team2Score);
        setOutcome(realResult.outcome);
        console.info(`Fetched real result for game ${game.id}:`, realResult);
      } else {
        console.info(
          `Real result for game ${game.id} not found, initializing with default values.`
        );
      }
    } catch (error) {
      console.error(`Error fetching real result for game ${game.id}:`, error);
    }
  };

  useEffect(() => {
    fetchRealResult();
  }, [game.id]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axiosInstance.post(
        `${API_URL}/realresults/${game.id}/result`,
        { team1Score, team2Score, outcome },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Real result saved successfully");
    } catch (error) {
      console.error("Error saving real result:", error);
    }
  };

  const handleOutcomeChange = () => {
    if (team1Score > team2Score) {
      setOutcome(`${game.team1} win`);
    } else if (team1Score < team2Score) {
      setOutcome(`${game.team2} win`);
    } else {
      setOutcome("draw");
    }
  };

  useEffect(() => {
    handleOutcomeChange();
  }, [team1Score, team2Score]);

  return (
    <div className="real-result">
      <div className="result-inputs">
        <span>{game.team1}</span>
        <input
          type="number"
          value={team1Score}
          onChange={(e) => setTeam1Score(parseInt(e.target.value))}
          disabled={!isAdmin}
        />
        <span>vs</span>
        <input
          type="number"
          value={team2Score}
          onChange={(e) => setTeam2Score(parseInt(e.target.value))}
          disabled={!isAdmin}
        />
        <span>{game.team2}</span>
      </div>
      <div className="result-outcome">{outcome || "No result yet"}</div>
      {isAdmin && (
        <button onClick={handleSave} className="save-button">
          Save Result
        </button>
      )}
    </div>
  );
}

export default RealResult;
