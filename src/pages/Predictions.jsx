import React from "react";
import { Link } from "react-router-dom";
import { groupStageGames } from "../gamesData";
import getFlagUrl from "../utils/getFlagUrl";
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
                    <th colSpan="7">{group}</th>
                  </tr>
                  <tr className="header-row">
                    <th>Team</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>G/D</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {groups[group].map((team, idx) => (
                    <tr key={idx} className="data-row">
                      <td className="team-cell">
                        <img
                          src={getFlagUrl(team)}
                          alt={team}
                          className="flag-icon"
                        />
                        {team}
                      </td>
                      <td className="win-cell">0</td>
                      <td className="draw-cell">0</td>
                      <td className="loss-cell">0</td>
                      <td className="gd-cell">0</td>
                      <td className="points-cell">0</td>
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
                  <th colSpan="7">Round of 16</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="round-cell">
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
