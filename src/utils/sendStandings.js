import axios from "axios";
import { calculateStandings } from "./calculateStandings";
import { populateKnockoutStages } from "./populateKnockoutStages";
import { API_URL } from "../config";

const allGroupsFinished = (groupGames) => {
  return Object.keys(groupGames).every((group) => {
    const games = groupGames[group];
    return games.every(
      (game) => game.team1Score !== undefined && game.team2Score !== undefined
    );
  });
};

export const calculateAndSendStandings = async (groupGames) => {
  if (!allGroupsFinished(groupGames)) {
    console.log("Not all groups have finished their games.");
    return;
  }

  const standings = calculateStandings(groupGames);
  const knockoutStages = populateKnockoutStages(standings);

  try {
    await axios.post(`${API_URL}/roundof16`, {
      fixtures: knockoutStages.roundOf16Games,
    });
    console.log("Round of 16 fixtures sent to the server");
  } catch (error) {
    console.error("Error sending Round of 16 fixtures:", error);
  }
};
