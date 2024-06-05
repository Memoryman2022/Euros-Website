import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import getFlagUrl from "../utils/getFlagUrl";
import { API_URL } from "../config";
import "../Css/Predictions.css";

// Initial teams in each group
const initialGroups = {
  "Group A": ["Germany", "Scotland", "Hungary", "Switzerland"],
  "Group B": ["Spain", "Croatia", "Italy", "Albania"],
  "Group C": ["Slovenia", "Denmark", "Serbia", "England"],
  "Group D": ["Poland", "Netherlands", "Austria", "France"],
  "Group E": ["Belgium", "Slovakia", "Romania", "Ukraine"],
  "Group F": ["Turkey", "Georgia", "Portugal", "Czechia"],
};

const getFullGroupName = (shortName) => {
  const mapping = {
    GA: "Group A",
    GB: "Group B",
    GC: "Group C",
    GD: "Group D",
    GE: "Group E",
    GF: "Group F",
  };
  return mapping[shortName] || shortName;
};

function PredictionsPage() {
  const [standings, setStandings] = useState({});

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await axios.get(`${API_URL}/groupStandings/latest`);
        console.log("Fetched standings data:", response.data);
        const standingsData = response.data || {};

        setStandings(standingsData);
      } catch (error) {
        console.error("Error fetching standings:", error);
      }
    };

    fetchStandings();
  }, []);

  return (
    <div className="predictions-container">
      <h2>Groups</h2>
      <div className="groups-list">
        {Object.keys(standings).map((group, index) => (
          <div key={index} className="group-item">
            <Link to={`/group/${group}`}>
              <table className="group-table">
                <thead>
                  <tr>
                    <th colSpan="6">{getFullGroupName(group)}</th>
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
                  {standings[group]?.map((team, idx) => (
                    <tr key={idx} className="data-row">
                      <td className="team-cell">
                        <img
                          src={getFlagUrl(team.name)}
                          alt={team.name}
                          className="flag-icon"
                        />
                        {team.name}
                      </td>
                      <td className="win-cell">{team.wins}</td>
                      <td className="draw-cell">{team.draws}</td>
                      <td className="loss-cell">{team.losses}</td>
                      <td className="gd-cell">{team.goalDifference}</td>
                      <td className="points-cell">{team.points}</td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="6">No data available</td>
                    </tr>
                  )}
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
                  <th colSpan="6">Round of 16</th>
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
                    Click here to view the Round of 16
                  </td>
                </tr>
              </tbody>
            </table>
          </Link>
        </div>
        <div className="group-item">
          <Link to="/quarter-finals">
            <table className="group-table">
              <thead>
                <tr>
                  <th colSpan="6">Quarter Finals</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="round-cell">
                    <img
                      src="/euro_fix.png"
                      alt="Quarter Finals"
                      className="flag-icon"
                    />
                    Click here to view the Quarter Finals
                  </td>
                </tr>
              </tbody>
            </table>
          </Link>
        </div>
        <div className="group-item">
          <Link to="/semi-finals">
            <table className="group-table">
              <thead>
                <tr>
                  <th colSpan="6">Semi Finals</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="round-cell">
                    <img
                      src="/euro_fix.png"
                      alt="Semi Finals"
                      className="flag-icon"
                    />
                    Click here to view the Semi Finals
                  </td>
                </tr>
              </tbody>
            </table>
          </Link>
        </div>
        <div className="group-item">
          <Link to="/final">
            <table className="group-table">
              <thead>
                <tr>
                  <th colSpan="6">Finals</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="round-cell">
                    <img
                      src="/euro_fix.png"
                      alt="Finals"
                      className="flag-icon"
                    />
                    Click here to view the Finals
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
