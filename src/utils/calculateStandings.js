// src/utils/calculateStandings.js

export const calculateStandings = (groupGames) => {
  const standings = {};

  // Initialize standings object
  Object.keys(groupGames).forEach((group) => {
    standings[group] = {};
    groupGames[group].forEach((game) => {
      standings[group][game.team1] = {
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      };
      standings[group][game.team2] = {
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      };
    });
  });

  // Calculate points, goalsFor, and goalsAgainst
  Object.keys(groupGames).forEach((group) => {
    groupGames[group].forEach((game) => {
      const team1 = standings[group][game.team1];
      const team2 = standings[group][game.team2];

      team1.goalsFor += game.team1Score;
      team1.goalsAgainst += game.team2Score;
      team2.goalsFor += game.team2Score;
      team2.goalsAgainst += game.team1Score;

      if (game.team1Score > game.team2Score) {
        team1.points += 3;
      } else if (game.team2Score > game.team1Score) {
        team2.points += 3;
      } else {
        team1.points += 1;
        team2.points += 1;
      }
    });
  });

  // Sort teams based on points, goal difference, and goals scored
  const sortedStandings = {};
  Object.keys(standings).forEach((group) => {
    sortedStandings[group] = Object.entries(standings[group])
      .sort(([, a], [, b]) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        } else {
          const goalDifferenceA = a.goalsFor - a.goalsAgainst;
          const goalDifferenceB = b.goalsFor - b.goalsAgainst;
          if (goalDifferenceB !== goalDifferenceA) {
            return goalDifferenceB - goalDifferenceA;
          } else {
            return b.goalsFor - a.goalsFor;
          }
        }
      })
      .reduce((acc, [team, stats], index) => {
        acc[index + 1] = team;
        return acc;
      }, {});
  });

  return sortedStandings;
};
