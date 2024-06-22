export const groupStageGames = {
  GA: [
    { id: "GA-1", date: "14 Jun 21:00", team1: "Germany", team2: "Scotland" },
    {
      id: "GA-2",
      date: "15 Jun 15:00",
      team1: "Hungary",
      team2: "Switzerland",
    },
    { id: "GA-3", date: "19 Jun 18:00", team1: "Germany", team2: "Hungary" },
    {
      id: "GA-4",
      date: "19 Jun 21:00",
      team1: "Scotland",
      team2: "Switzerland",
    },
    {
      id: "GA-5",
      date: "23 Jun 21:00",
      team1: "Switzerland",
      team2: "Germany",
    },
    { id: "GA-6", date: "23 Jun 21:00", team1: "Scotland", team2: "Hungary" },
  ],
  GB: [
    { id: "GB-1", date: "15 Jun 18:00", team1: "Spain", team2: "Croatia" },
    { id: "GB-2", date: "15 Jun 21:00", team1: "Italy", team2: "Albania" },
    { id: "GB-3", date: "19 Jun 15:00", team1: "Croatia", team2: "Albania" },
    { id: "GB-4", date: "20 Jun 21:00", team1: "Spain", team2: "Italy" },
    { id: "GB-5", date: "24 Jun 21:00", team1: "Albania", team2: "Spain" },
    { id: "GB-6", date: "24 Jun 21:00", team1: "Croatia", team2: "Italy" },
  ],
  GC: [
    { id: "GC-1", date: "16 Jun 18:00", team1: "Slovenia", team2: "Denmark" },
    { id: "GC-2", date: "16 Jun 21:00", team1: "Serbia", team2: "England" },
    { id: "GC-3", date: "20 Jun 15:00", team1: "Slovenia", team2: "Serbia" },
    { id: "GC-4", date: "20 Jun 18:00", team1: "Denmark", team2: "England" },
    { id: "GC-5", date: "25 Jun 21:00", team1: "England", team2: "Slovenia" },
    { id: "GC-6", date: "25 Jun 21:00", team1: "Denmark", team2: "Serbia" },
  ],
  GD: [
    { id: "GD-1", date: "16 Jun 15:00", team1: "Poland", team2: "Netherlands" },
    { id: "GD-2", date: "17 Jun 21:00", team1: "Austria", team2: "France" },
    { id: "GD-3", date: "21 Jun 18:00", team1: "Poland", team2: "Austria" },
    { id: "GD-4", date: "21 Jun 21:00", team1: "Netherlands", team2: "France" },
    {
      id: "GD-5",
      date: "25 Jun 18:00",
      team1: "Netherlands",
      team2: "Austria",
    },
    { id: "GD-6", date: "25 Jun 18:00", team1: "France", team2: "Poland" },
  ],
  GE: [
    { id: "GE-1", date: "17 Jun 15:00", team1: "Romania", team2: "Ukraine" },
    { id: "GE-2", date: "17 Jun 18:00", team1: "Belgium", team2: "Slovakia" },
    { id: "GE-3", date: "21 Jun 15:00", team1: "Slovakia", team2: "Ukraine" },
    { id: "GE-4", date: "22 Jun 21:00", team1: "Belgium", team2: "Romania" },
    { id: "GE-5", date: "26 Jun 18:00", team1: "Slovakia", team2: "Romania" },
    { id: "GE-6", date: "26 Jun 18:00", team1: "Ukraine", team2: "Belgium" },
  ],
  GF: [
    { id: "GF-1", date: "18 Jun 18:00", team1: "Turkey", team2: "Georgia" },
    { id: "GF-2", date: "18 Jun 21:00", team1: "Portugal", team2: "Czechia" },
    { id: "GF-3", date: "22 Jun 18:00", team1: "Turkey", team2: "Portugal" },
    { id: "GF-4", date: "22 Jun 15:00", team1: "Georgia", team2: "Czechia" },
    { id: "GF-5", date: "26 Jun 21:00", team1: "Georgia", team2: "Portugal" },
    { id: "GF-6", date: "26 Jun 21:00", team1: "Czechia", team2: "Turkey" },
  ],
};

export const roundOf16Games = [
  { id: "R16-1", date: "29 Jun 18:00", team1: "2A", team2: "2B" },
  { id: "R16-2", date: "29 Jun 21:00", team1: "1A", team2: "2C" },
  { id: "R16-3", date: "30 Jun 18:00", team1: "1C", team2: "3D/E/F" },
  { id: "R16-4", date: "30 Jun 21:00", team1: "1B", team2: "3A/D/E/F" },
  { id: "R16-5", date: "01 Jul 18:00", team1: "2D", team2: "2E" },
  { id: "R16-6", date: "01 Jul 21:00", team1: "1F", team2: "3A/B/C" },
  { id: "R16-7", date: "02 Jul 18:00", team1: "1E", team2: "3A/B/C/D" },
  { id: "R16-8", date: "02 Jul 21:00", team1: "1D", team2: "2F" },
];

export const quarterFinalGames = [
  { id: "Q1", date: "05 Jul 18:00", team1: "R16-4", team2: "R16-2" },
  { id: "Q2", date: "05 Jul 21:00", team1: "R16-6", team2: "R16-5" },
  { id: "Q3", date: "06 Jul 18:00", team1: "R16-3", team2: "R16-1" },
  { id: "Q4", date: "06 Jul 21:00", team1: "R16-7", team2: "R16-8" },
];

export const semiFinalGames = [
  { id: "S1", date: "09 Jul 21:00", team1: "Q1", team2: "Q2" },
  { id: "S2", date: "10 Jul 21:00", team1: "Q3", team2: "Q4" },
];

export const finalGame = [
  { id: "F1", date: "14 Jul 21:00", team1: "S1", team2: "S2" },
];

export const groupStandings = {
  "Group A": { "1st": "", "2nd": "", "3rd": "", "4th": "" },
  "Group B": { "1st": "", "2nd": "", "3rd": "", "4th": "" },
  "Group C": { "1st": "", "2nd": "", "3rd": "", "4th": "" },
  "Group D": { "1st": "", "2nd": "", "3rd": "", "4th": "" },
  "Group E": { "1st": "", "2nd": "", "3rd": "", "4th": "" },
  "Group F": { "1st": "", "2nd": "", "3rd": "", "4th": "" },
  // Add other groups similarly
};
