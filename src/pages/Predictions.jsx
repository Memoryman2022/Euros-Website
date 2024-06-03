import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { groupStageGames } from "../gamesData";
import getFlagUrl from "../utils/getFlagUrl";
import { calculateStandings } from "../utils/calculateStandings";
import { API_URL } from "../config";
import "../Css/Predictions.css";

// Initial teams in each group
const initialGroups = {
  "Group A": ["Germany", "Scotland", "Hungary", "Switzerland"],
  "Group B": ["Spain", "Croatia", "Italy", "Albania"],
  "Group C": ["Slovenia", "Denmark", "Serbia", "England"],
  "Group D": ["Poland", "Netherlands", "Austria", "France"],
  "Group E": ["Belgium", "Slovakia", "Romania", "Ukraine"],
  "Group F": ["Turkey", "Georgia", "Portugal", "Czechia"],
};

function PredictionsPage() {
  const [standings, setStandings] = useState({});

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await axios.get(`${API_URL}/realresults`);
        const realResults = response.data;

        const updatedGames = { ...groupStageGames };
        realResults.forEach((result) => {
          const group = Object.keys(updatedGames).find((grp) =>
            updatedGames[grp].some((game) => game.id === result.gameId)
          );
          if (group) {
            const gameIndex = updatedGames[group].findIndex(
              (game) => game.id === result.gameId
            );
            if (gameIndex > -1) {
              updatedGames[group][gameIndex].team1Score = result.team1Score;
              updatedGames[group][gameIndex].team2Score = result.team2Score;
            }
          }
        });

        const standingsResponse = await axios.post(
          `${API_URL}/standings/calculate`,
          {
            groupStageGames: updatedGames,
          }
        );

        setStandings(standingsResponse.data);
      } catch (error) {
        console.error("Error fetching standings:", error);
      }
    };

    fetchStandings();
  }, []);

  return (
    <div className="predictions-container">
      <h2>Groups</h2>
      <div className="groups-list">
        {Object.keys(initialGroups).map((group, index) => (
          <div key={index} className="group-item">
            <Link to={`/group/${group}`}>
              <table className="group-table">
                <thead>
                  <tr>
                    <th colSpan="6">{group}</th>
                  </tr>
                  <tr className="header-row">
                    <th>Team</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>G/D</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(standings[group] || {}).map((team, idx) => {
                    const teamStats = standings[group][team];

                    return (
                      <tr key={idx} className="data-row">
                        <td className="team-cell">
                          <img
                            src={getFlagUrl(team)}
                            alt={team}
                            className="flag-icon"
                          />
                          {team}
                        </td>
                        <td className="win-cell">{teamStats.wins}</td>
                        <td className="draw-cell">{teamStats.draws}</td>
                        <td className="loss-cell">{teamStats.losses}</td>
                        <td className="gd-cell">{teamStats.goalDifference}</td>
                        <td className="points-cell">{teamStats.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Link>
          </div>
        ))}
        <div className="group-item">
          <Link to="/round-of-16">
            <table className="group-table">
              <thead>
                <tr>
                  <th colSpan="6">Round of 16</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="round-cell">
                    <img
                      src="/euro_fix.png"
                      alt="Round of 16"
                      className="flag-icon"
                    />
                    Click here to view the Round of 16 predictions
                  </td>
                </tr>
              </tbody>
            </table>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PredictionsPage;
