import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../Css/GroupDetails.css";

const games = {
  "Group A": [
    { date: "14 Jun 20:00", team1: "Germany", team2: "Scotland" },
    { date: "15 Jun 14:00", team1: "Hungary", team2: "Switzerland" },
    { date: "19 Jun 17:00", team1: "Germany", team2: "Hungary" },
    { date: "19 Jun 20:00", team1: "Scotland", team2: "Switzerland" },
    { date: "23 Jun 20:00", team1: "Switzerland", team2: "Germany" },
    { date: "23 Jun 20:00", team1: "Scotland", team2: "Hungary" },
  ],
  "Group B": [
    { date: "15 Jun 17:00", team1: "Spain", team2: "Croatia" },
    { date: "15 Jun 20:00", team1: "Italy", team2: "Albania" },
    { date: "19 Jun 14:00", team1: "Croatia", team2: "Albania" },
    { date: "20 Jun 20:00", team1: "Spain", team2: "Italy" },
    { date: "24 Jun 20:00", team1: "Albania", team2: "Spain" },
    { date: "24 Jun 20:00", team1: "Croatia", team2: "Italy" },
  ],
  "Group C": [
    { date: "16 Jun 17:00", team1: "Slovenia", team2: "Denmark" },
    { date: "16 Jun 20:00", team1: "Serbia", team2: "England" },
    { date: "20 Jun 14:00", team1: "Slovenia", team2: "Serbia" },
    { date: "20 Jun 17:00", team1: "Denmark", team2: "England" },
    { date: "25 Jun 20:00", team1: "England", team2: "Slovenia" },
    { date: "25 Jun 20:00", team1: "Denmark", team2: "Serbia" },
  ],
  "Group D": [
    { date: "16 Jun 14:00", team1: "Poland", team2: "Netherlands" },
    { date: "17 Jun 20:00", team1: "Austria", team2: "France" },
    { date: "21 Jun 17:00", team1: "Poland", team2: "Austria" },
    { date: "21 Jun 20:00", team1: "Netherlands", team2: "France" },
    { date: "25 Jun 17:00", team1: "Netherlands", team2: "Austria" },
    { date: "25 Jun 17:00", team1: "France", team2: "Poland" },
  ],
  "Group E": [
    { date: "17 Jun 14:00", team1: "Romania", team2: "Ukraine" },
    { date: "17 Jun 17:00", team1: "Belgium", team2: "Slovakia" },
    { date: "21 Jun 14:00", team1: "Slovakia", team2: "Ukraine" },
    { date: "22 Jun 20:00", team1: "Belgium", team2: "Romania" },
    { date: "26 Jun 17:00", team1: "Slovakia", team2: "Romania" },
    { date: "26 Jun 17:00", team1: "Ukraine", team2: "Belgium" },
  ],
  "Group F": [
    { date: "18 Jun 17:00", team1: "Turkey", team2: "Georgia" },
    { date: "18 Jun 20:00", team1: "Portugal", team2: "Czechia" },
    { date: "22 Jun 14:00", team1: "Turkey", team2: "Portugal" },
    { date: "22 Jun 17:00", team1: "Georgia", team2: "Czechia" },
    { date: "26 Jun 20:00", team1: "Georgia", team2: "Portugal" },
    { date: "26 Jun 20:00", team1: "Czechia", team2: "Turkey" },
  ],
};

// Add the flag exceptions mapping
const flagExceptions = {
  Slovakia: "slov",
  // Add more exceptions here if needed
};

// Modify the getFlagUrl function to handle exceptions
const getFlagUrl = (team) => {
  const flagCode = flagExceptions[team] || team.substring(0, 3).toLowerCase();
  return `/flags/${flagCode}.png`;
};

function GroupDetails() {
  const { group } = useParams();
  const groupGames = games[group];
  const [confirmed, setConfirmed] = useState(
    Array(groupGames.length).fill(false)
  );
  const [selectedOutcome, setSelectedOutcome] = useState(
    Array(groupGames.length).fill(null)
  );

  const handleConfirm = (index) => {
    const newConfirmed = [...confirmed];
    newConfirmed[index] = true;
    setConfirmed(newConfirmed);
  };

  const handleCheckboxChange = (gameIndex, outcome) => {
    const newSelectedOutcome = [...selectedOutcome];
    newSelectedOutcome[gameIndex] = outcome;
    setSelectedOutcome(newSelectedOutcome);
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
    <div className="group-details-container">
      <h2>{group}</h2>
      {groupGames.map((game, index) => (
        <div key={index} className="game-item">
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
              <select className="score-select" disabled={confirmed[index]}>
                {renderScoreOptions()}
              </select>
            </div>
            <span className="versus">V</span>
            <div className="team-container">
              <select className="score-select" disabled={confirmed[index]}>
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
        </div>
      ))}
      <Link to="/predictions" className="back-button">
        Back to Groups
      </Link>
    </div>
  );
}

export default GroupDetails;
