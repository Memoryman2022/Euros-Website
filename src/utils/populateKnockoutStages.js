// src/utils/populateKnockoutStages.js

export const populateKnockoutStages = (standings) => {
  const roundOf16Games = [
    {
      id: "R16-1",
      date: "29 Jun 17:00",
      team1: standings["Group A"]["2nd"],
      team2: standings["Group B"]["2nd"],
    },
    {
      id: "R16-2",
      date: "29 Jun 20:00",
      team1: standings["Group A"]["1st"],
      team2: standings["Group C"]["2nd"],
    },
    {
      id: "R16-3",
      date: "30 Jun 17:00",
      team1: standings["Group C"]["1st"],
      team2: "3rd D/E/F",
    }, // Logic for best 3rd place teams needed
    {
      id: "R16-4",
      date: "30 Jun 20:00",
      team1: standings["Group B"]["1st"],
      team2: "3rd A/D/E/F",
    },
    {
      id: "R16-5",
      date: "01 Jul 17:00",
      team1: standings["Group D"]["2nd"],
      team2: standings["Group E"]["2nd"],
    },
    {
      id: "R16-6",
      date: "01 Jul 20:00",
      team1: standings["Group F"]["1st"],
      team2: "3rd A/B/C",
    },
    {
      id: "R16-7",
      date: "02 Jul 17:00",
      team1: standings["Group E"]["1st"],
      team2: "3rd A/B/C/D",
    },
    {
      id: "R16-8",
      date: "02 Jul 20:00",
      team1: standings["Group D"]["1st"],
      team2: standings["Group F"]["2nd"],
    },
  ];

  const quarterFinalGames = [
    {
      id: "Q1",
      date: "05 Jul 17:00",
      team1: roundOf16Games[3].winner,
      team2: roundOf16Games[1].winner,
    },
    {
      id: "Q2",
      date: "05 Jul 20:00",
      team1: roundOf16Games[5].winner,
      team2: roundOf16Games[4].winner,
    },
    {
      id: "Q3",
      date: "06 Jul 17:00",
      team1: roundOf16Games[2].winner,
      team2: roundOf16Games[0].winner,
    },
    {
      id: "Q4",
      date: "06 Jul 20:00",
      team1: roundOf16Games[6].winner,
      team2: roundOf16Games[7].winner,
    },
  ];

  const semiFinalGames = [
    {
      id: "S1",
      date: "09 Jul 20:00",
      team1: quarterFinalGames[0].winner,
      team2: quarterFinalGames[1].winner,
    },
    {
      id: "S2",
      date: "10 Jul 20:00",
      team1: quarterFinalGames[2].winner,
      team2: quarterFinalGames[3].winner,
    },
  ];

  const finalGame = [
    {
      id: "F1",
      date: "14 Jul 20:00",
      team1: semiFinalGames[0].winner,
      team2: semiFinalGames[1].winner,
    },
  ];

  return { roundOf16Games, quarterFinalGames, semiFinalGames, finalGame };
};
