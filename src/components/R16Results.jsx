import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import getFlagUrl from "../utils/getFlagUrl";
import "../Css/Predictions.css";

const RoundOf16Results = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${API_URL}/realResults`);
        const resultsData = response.data || [];

        // Filter results for Round of 16
        const roundOf16 = resultsData.filter((result) =>
          result.gameId.startsWith("R")
        );

        setResults(roundOf16);
      } catch (error) {
        console.error("Error fetching real results:", error);
      }
    };

    fetchResults();
  }, []);

  if (results.length === 0) return null;

  return (
    <div className="group-item">
      <table className="group-table">
        <tbody>
          {results.map((result, index) => (
            <React.Fragment key={index}>
              <tr className="header-row">
                <th colSpan="6">{result.gameId}</th>
              </tr>
              <tr className="data-row">
                <td className="team-cell">
                  <img
                    src={getFlagUrl(result.team1)}
                    alt={result.team1}
                    className="flag-icon"
                  />
                  {result.team1}
                </td>
                <td className="score-cell">{result.team1Score}</td>
                <td className="versus-cell">vs</td>
                <td className="score-cell">{result.team2Score}</td>
                <td className="team-cell">
                  <img
                    src={getFlagUrl(result.team2)}
                    alt={result.team2}
                    className="flag-icon"
                  />
                  {result.team2}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoundOf16Results;
