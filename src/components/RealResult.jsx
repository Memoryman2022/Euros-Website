import React, { useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../authContext/auth.context";
import { API_URL } from "../config";
import "../Css/RealResult.css";

function RealResult({ game, index }) {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [outcome, setOutcome] = useState("");

  const handleSave = async () => {
    try {
      await axiosInstance.post(`${API_URL}/realresults/${game.id}/result`, {
        team1: game.team1,
        team2: game.team2,
        team1Score,
        team2Score,
        outcome,
      });
      console.log("Real result saved successfully");
    } catch (error) {
      console.error("Error saving real result:", error);
    }
  };

  if (!isAdmin) {
    return null; // Hide the component for non-admin users
  }

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
      <div className="result-outcome">
        {isAdmin ? (
          <select value={outcome} onChange={(e) => setOutcome(e.target.value)}>
            <option value="">Select Outcome</option>
            <option value="team1 win">{game.team1} win</option>
            <option value="draw">Draw</option>
            <option value="team2 win">{game.team2} win</option>
          </select>
        ) : (
          outcome || "No result yet"
        )}
      </div>
      {isAdmin && (
        <button onClick={handleSave} className="save-button">
          Save Result
        </button>
      )}
    </div>
  );
}

export default RealResult;
