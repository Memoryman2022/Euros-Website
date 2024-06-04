import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import UpdateQuarterFinals from "../components/UpdateQuarterFinals";

const QuarterFinalPage = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchQuarterFinalGames = async () => {
      try {
        const response = await axios.get(`${API_URL}/quarterfinals`);
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching quarter-final games:", error);
      }
    };

    fetchQuarterFinalGames();
  }, []);

  return (
    <div className="quarter-final-container">
      <h2>Quarter-Final Games</h2>
      {games.map((game, index) => (
        <div key={index} className="game-item">
          <div className="game-date">{game.date}</div>
          <div className="team-container">
            <span className="team-name">{game.team1}</span>
            <span className="versus">V</span>
            <span className="team-name">{game.team2}</span>
          </div>
        </div>
      ))}
      <UpdateQuarterFinals />
    </div>
  );
};

export default QuarterFinalPage;
