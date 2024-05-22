// src/pages/PredictionsPage.jsx
import React from "react";
import { Link } from "react-router-dom";
//component imports
import { groupStageGames } from "../gamesData";
import getFlagUrl from "../utils/getFlagUrl";
//css
import "../Css/Predictions.css";

const groups = {
  "Group A": ["Germany", "Scotland", "Hungary", "Switzerland"],
  "Group B": ["Spain", "Croatia", "Italy", "Albania"],
  "Group C": ["Slovenia", "Denmark", "Serbia", "England"],
  "Group D": ["Poland", "Netherlands", "Austria", "France"],
  "Group E": ["Belgium", "Slovakia", "Romania", "Ukraine"],
  "Group F": ["Turkey", "Georgia", "Portugal", "Czechia"],
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
        <div className="group-item">
          <Link to="/round-of-16">
            <table className="group-table">
              <thead>
                <tr>
                  <th colSpan="2">Round of 16</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <img
                      src="/euro_fix.png"
                      alt="Round of 16"
                      className="flag-icon"
                    />
                    Round of 16
                  </td>
                </tr>
              </tbody>
            </table>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PredictionsPage;
