import React, { useState, useEffect, useContext } from "react";
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
