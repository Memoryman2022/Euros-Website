import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "../Css/ScoreMatrix.css";

const ScoreMatrix = () => {
  const [users, setUsers] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [realResults, setRealResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const [usersRes, predictionsRes, realResultsRes] = await Promise.all([
          axios.get(`${API_URL}/users`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${API_URL}/predictions/all`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${API_URL}/realresults`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setUsers(usersRes.data);
        setPredictions(predictionsRes.data);
        setRealResults(realResultsRes.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateUserScores = () => {
    return users.map((user) => {
      let correctOutcomes = 0;
      let correctScores = 0;
      let totalScore = 0;
      let hypotheticalScore = 0;

      predictions
        .filter((prediction) => prediction.userId === user._id)
        .forEach((prediction) => {
          const result = realResults.find(
            (result) => result.gameId === prediction.gameId
          );

          if (result) {
            const predictedOutcome =
              prediction.team1Score > prediction.team2Score
                ? "team1"
                : prediction.team1Score < prediction.team2Score
                ? "team2"
                : "draw";
            const actualOutcome =
              result.team1Score > result.team2Score
                ? "team1"
                : result.team1Score < result.team2Score
                ? "team2"
                : "draw";

            if (predictedOutcome === actualOutcome) {
              correctOutcomes += 1;
              totalScore += 2; // 2 points for correct outcome
            }

            if (
              prediction.team1Score === result.team1Score &&
              prediction.team2Score === result.team2Score
            ) {
              correctScores += 1;
              totalScore += 5; // 5 points for correct score
            }

            // Hypothetical score if the real result was one goal different
            if (
              Math.abs(prediction.team1Score - result.team1Score) <= 1 &&
              Math.abs(prediction.team2Score - result.team2Score) <= 1
            ) {
              hypotheticalScore += 5; // Additional 5 points for hypothetical correct score
            }
          }
        });

      return {
        ...user,
        correctOutcomes,
        correctScores,
        totalScore,
        hypotheticalScore: totalScore + hypotheticalScore,
      };
    });
  };

  const userScores = calculateUserScores();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="score-matrix-page">
      <h2>Score Matrix</h2>
      <div className="score-matrix-container">
        <table className="score-matrix-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Correct Outcomes</th>
              <th>Correct Scores</th>
              <th>Total Score</th>
              <th>+/-1 Score</th>
            </tr>
          </thead>
          <tbody>
            {userScores.map((user, index) => (
              <tr key={index}>
                <td className="name">
                  <img
                    src={`${API_URL.replace("/api", "")}${user.profileImage}`}
                    alt="Profile"
                    className="profile-pic"
                  />
                  {user.userName}
                </td>
                <td className="correct-outcomes">{user.correctOutcomes}</td>
                <td className="correct-scores">{user.correctScores}</td>
                <td className="total-score">{user.totalScore}</td>
                <td className="hypothetical-score">{user.hypotheticalScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoreMatrix;
