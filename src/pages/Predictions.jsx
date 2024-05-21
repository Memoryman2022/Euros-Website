import React from "react";
import { Link } from "react-router-dom";
import "../Css/Predictions.css";

const groups = {
  "Group A": ["Germany", "Scotland", "Hungary", "Switzerland"],
  "Group B": ["Spain", "Croatia", "Italy", "Albania"],
  "Group C": ["Slovenia", "Denmark", "Serbia", "England"],
  "Group D": ["Poland", "Netherlands", "Austria", "France"],
  "Group E": ["Belgium", "Slovakia", "Romania", "Ukraine"],
  "Group F": ["Turkey", "Georgia", "Portugal", "Czechia"],
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

function PredictionsPage() {
  return (
    <div className="predictions-container">
      <h2>Groups</h2>
      <div className="groups-list">
        {Object.keys(groups).map((group, index) => (
          <div key={index} className="group-item">
            <Link to={`/group/${group}`}>
              <table className="group-table">
                <thead>
                  <tr>
                    <th colSpan="2">{group}</th>
                  </tr>
                </thead>
                <tbody>
                  {groups[group].map((team, idx) => (
                    <tr key={idx}>
                      <td>
                        <img
                          src={getFlagUrl(team)}
                          alt={team}
                          className="flag-icon"
                        />
                        {team}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PredictionsPage;
