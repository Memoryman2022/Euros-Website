import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../Css/GroupDetails.css";

const games = {
  "Group A": [
    { team1: "Germany", team2: "Scotland" },
    { team1: "Hungary", team2: "Switzerland" },
    { team1: "Germany", team2: "Hungary" },
    { team1: "Scotland", team2: "Switzerland" },
    { team1: "Switzerland", team2: "Germany" },
  ],
  "Group B": [
    { team1: "Spain", team2: "Croatia" },
    { team1: "Italy", team2: "Albania" },
    { team1: "Spain", team2: "Italy" },
    { team1: "Croatia", team2: "Albania" },
  ],
  "Group C": [
    { team1: "Slovenia", team2: "Denmark" },
    { team1: "Serbia", team2: "England" },
    { team1: "Slovenia", team2: "Serbia" },
    { team1: "Denmark", team2: "England" },
  ],
  "Group D": [
    { team1: "Poland", team2: "Netherlands" },
    { team1: "Austria", team2: "France" },
    { team1: "Poland", team2: "Austria" },
    { team1: "Netherlands", team2: "France" },
  ],
  "Group E": [
    { team1: "Belgium", team2: "Slovakia" },
    { team1: "Romania", team2: "Ukraine" },
    { team1: "Belgium", team2: "Romania" },
    { team1: "Slovakia", team2: "Ukraine" },
  ],
  "Group F": [
    { team1: "Turkey", team2: "Georgia" },
    { team1: "Portugal", team2: "Czechia" },
    { team1: "Turkey", team2: "Portugal" },
    { team1: "Georgia", team2: "Czechia" },
  ],
};

function GroupDetails() {
  const { group } = useParams();
  const groupGames = games[group];
  const [confirmed, setConfirmed] = useState(
    Array(groupGames.length).fill(false)
  );

  const handleConfirm = (index) => {
    const newConfirmed = [...confirmed];
    newConfirmed[index] = true;
    setConfirmed(newConfirmed);
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
          <div className="team-container">
            <span className="team-name">{game.team1}</span>
            <select className="score-select" disabled={confirmed[index]}>
              {renderScoreOptions()}
            </select>
          </div>
          <span className="versus">V</span>
          <div className="team-container">
            <select className="score-select" disabled={confirmed[index]}>
              {renderScoreOptions()}
            </select>
            <span className="team-name">{game.team2}</span>
          </div>
          <button
            className="confirm-button"
            onClick={() => handleConfirm(index)}
            disabled={confirmed[index]}
          >
            Confirm
          </button>
          <div className="checkbox-container">
            <label>
              <input type="checkbox" disabled={confirmed[index]} />
              {game.team1} win
            </label>
            <label>
              <input type="checkbox" disabled={confirmed[index]} />
              Draw
            </label>
            <label>
              <input type="checkbox" disabled={confirmed[index]} />
              {game.team2} win
            </label>
          </div>
        </div>
      ))}
      <Link to="/predictions" className="back-button">
        Back to Predictions
      </Link>
    </div>
  );
}

export default GroupDetails;
