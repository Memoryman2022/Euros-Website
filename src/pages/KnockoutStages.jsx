// src/pages/KnockoutStages.jsx

import React, { useEffect, useState } from "react";
import { calculateStandings } from "../utils/calculateStandings";
import { populateKnockoutStages } from "../utils/populateKnockoutStages";
import { groupStageGames } from "../gamesData";

function KnockoutStages() {
  const [knockoutGames, setKnockoutGames] = useState({});

  useEffect(() => {
    const newStandings = calculateStandings(groupStageGames);
    const newKnockoutGames = populateKnockoutStages(newStandings);
    setKnockoutGames(newKnockoutGames);
  }, []);

  return (
    <div>
      <h4>Round of 16</h4>
      {knockoutGames.roundOf16Games &&
        knockoutGames.roundOf16Games.map((game) => (
          <div key={game.id}>
            <p>{game.date}</p>
            <p>
              {game.team1} vs {game.team2}
            </p>
          </div>
        ))}
      <h4>Quarter Finals</h4>
      {knockoutGames.quarterFinalGames &&
        knockoutGames.quarterFinalGames.map((game) => (
          <div key={game.id}>
            <p>{game.date}</p>
            <p>
              {game.team1} vs {game.team2}
            </p>
          </div>
        ))}
      <h4>Semi Finals</h4>
      {knockoutGames.semiFinalGames &&
        knockoutGames.semiFinalGames.map((game) => (
          <div key={game.id}>
            <p>{game.date}</p>
            <p>
              {game.team1} vs {game.team2}
            </p>
          </div>
        ))}
      <h4>Final</h4>
      {knockoutGames.finalGame &&
        knockoutGames.finalGame.map((game) => (
          <div key={game.id}>
            <p>{game.date}</p>
            <p>
              {game.team1} vs {game.team2}
            </p>
          </div>
        ))}
    </div>
  );
}

export default KnockoutStages;
