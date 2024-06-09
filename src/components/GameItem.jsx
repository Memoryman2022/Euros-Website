import React from "react";
import getFlagUrl from "../utils/getFlagUrl";
import { parse, differenceInMilliseconds } from "date-fns";

const ONE_HOUR = 60 * 60 * 1000; // Define ONE_HOUR in milliseconds

const GameItem = ({
  game,
  index,
  confirmed,
  selectedOutcome,
  team1Scores,
  team2Scores,
  onScoreChange,
  onCheckboxChange,
  onShowModal,
}) => {
  const isPredictionWindowExpired = (gameDate) => {
    const matchStartTime = parse(
      `${gameDate} ${new Date().getFullYear()}`,
      "dd MMM HH:mm yyyy",
      new Date()
    );
    const currentTime = new Date();
    return differenceInMilliseconds(matchStartTime, currentTime) <= ONE_HOUR;
  };

  const isExpired = isPredictionWindowExpired(game.date);
  const isKnockoutStage =
    game.id.startsWith("R") ||
    game.id.startsWith("Q") ||
    game.id.startsWith("S") ||
    game.id.startsWith("F");

  const getFlagSrc = (team) => {
    return team.includes("1") || team.includes("2") || team.includes("3")
      ? "/euro_fix.png"
      : getFlagUrl(team);
  };

  return (
    <div className={`game-item ${confirmed ? "confirmed" : ""}`}>
      <div className="game-row">
        <div className="game-date">{game.date}</div>
        <div className="team-container">
          <span className="team-name">
            <img
              src={getFlagSrc(game.team1)}
              alt={game.team1}
              className="flag-icon"
              onError={(e) => {
                e.target.onerror = null; // prevents looping
                e.target.src = "/euro_fix.png";
              }}
            />
            {game.team1}
          </span>
          <select
            className="score-select"
            disabled={confirmed || isExpired}
            value={team1Scores}
            onChange={(e) =>
              onScoreChange(index, "team1", parseInt(e.target.value))
            }
          >
            {[...Array(11).keys()].map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <span className="versus">V</span>
        <div className="team-container">
          <select
            className="score-select"
            disabled={confirmed || isExpired}
            value={team2Scores}
            onChange={(e) =>
              onScoreChange(index, "team2", parseInt(e.target.value))
            }
          >
            {[...Array(11).keys()].map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          <span className="team-name">
            <img
              src={getFlagSrc(game.team2)}
              alt={game.team2}
              className="flag-icon"
              onError={(e) => {
                e.target.onerror = null; // prevents looping
                e.target.src = "/euro_fix.png";
              }}
            />
            {game.team2}
          </span>
        </div>
      </div>
      <div className="checkbox-container">
        <label>
          {game.team1} win
          <input
            type="checkbox"
            checked={selectedOutcome === "team1"}
            onChange={() => onCheckboxChange(index, "team1")}
            disabled={confirmed || isExpired}
          />
        </label>
        {!isKnockoutStage && (
          <label>
            Draw
            <input
              type="checkbox"
              checked={selectedOutcome === "draw"}
              onChange={() => onCheckboxChange(index, "draw")}
              disabled={confirmed || isExpired}
            />
          </label>
        )}
        <label>
          {game.team2} win
          <input
            type="checkbox"
            checked={selectedOutcome === "team2"}
            onChange={() => onCheckboxChange(index, "team2")}
            disabled={confirmed || isExpired}
          />
        </label>
      </div>
      <button
        className="confirm-button"
        onClick={() => onShowModal(index)}
        disabled={confirmed || isExpired}
      >
        Confirm
      </button>
      {isExpired && !confirmed && (
        <div className="expired-message">
          The prediction window has expired for this match.
        </div>
      )}
    </div>
  );
};

export default GameItem;
