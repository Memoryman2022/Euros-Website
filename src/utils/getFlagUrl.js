// src/utils/getFlagUrl.js
const flagExceptions = {
  Slovakia: "slov",
  // Add more exceptions here if needed
};

const getFlagUrl = (team) => {
  if (team.includes("1") || team.includes("2") || team.includes("3")) {
    // If the team is a placeholder (e.g., "1A", "2B", "3D/E/F"), use the placeholder image
    return "/flags/euro_fix.png";
  }
  const flagCode = flagExceptions[team] || team.substring(0, 3).toLowerCase();
  return `/flags/${flagCode}.png`;
};

export default getFlagUrl;
