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
                      <td>{team}</td>
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
