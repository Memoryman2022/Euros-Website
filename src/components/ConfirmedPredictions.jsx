// src/components/ConfirmedPredictions.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../authContext/auth.context";
import { API_URL } from "../config";

import "../Css/ConfirmedPredictions.css";

const ConfirmedPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPredictions = async () => {
    const userId = localStorage.getItem("userId"); // Ensure the userId is correctly stored
    const token = localStorage.getItem("jwtToken");
    if (!userId || !token) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/users/${userId}/predictions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPredictions(response.data);
    } catch (error) {
      setError("Failed to fetch predictions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="confirmed-predictions">
      <h3>Confirmed Predictions</h3>
      <ul>
        {predictions.map((prediction) => (
          <li key={prediction._id}>
            {prediction.team1} vs {prediction.team2}: {prediction.team1Score} -{" "}
            {prediction.team2Score} ({prediction.predictedOutcome})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConfirmedPredictions;
