import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import getFlagUrl from "../utils/getFlagUrl";
import "../Css/FinalPredictions.css";

const getFullGroupName = (gameId) => {
  const group = gameId.split("-")[0];
  const mapping = {
    GA: "Group A",
    GB: "Group B",
    GC: "Group C",
    GD: "Group D",
    GE: "Group E",
    GF: "Group F",
  };
  return mapping[group] || gameId;
};

const FinalPredictions = () => {
  const [groupedPredictions, setGroupedPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight
  );
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 500);
  const [visibleGroups, setVisibleGroups] = useState({});

  const fetchFinalPredictions = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/predictions/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched Predictions:", response.data);

      // Sort predictions by date
      const sortedPredictions = response.data.sort(
        (a, b) => new Date(a.startTime) - new Date(b.startTime)
      );

      // Group predictions by group
      const grouped = sortedPredictions.reduce((acc, game) => {
        const groupName = getFullGroupName(game.gameId);
        if (!acc[groupName]) {
          acc[groupName] = [];
        }
        acc[groupName].push(game);
        return acc;
      }, {});

      setGroupedPredictions(grouped);
    } catch (error) {
      setError("Failed to fetch final predictions");
      console.error("Fetch Final Predictions Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinalPredictions();

    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
      setIsSmallScreen(window.innerWidth <= 500);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleVisibility = (groupName) => {
    setVisibleGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const allUsersPredicted = (predictions) => {
    const TOTAL_USERS = 14;
    return predictions.length === TOTAL_USERS;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (isSmallScreen && !isLandscape) {
    return (
      <div className="orientation-prompt">
        Please switch to landscape mode for a better experience.
      </div>
    );
  }

  return (
    <div className="final-predictions-container">
      <div className="text-CP">
        <h4>Final Predictions</h4>
        Predictions will be revealed one hour before the match OR when all users
        have submitted their predictions for a given match. Click the group to
        reveal fixtures, and click the fixture to reveal predictions.
      </div>
      {Object.keys(groupedPredictions)
        .sort()
        .map((groupName) => (
          <div key={groupName} className="group-predictions">
            <h3 onClick={() => toggleVisibility(groupName)}>{groupName}</h3>
            {visibleGroups[groupName] && (
              <div className="group-fixtures">
                {groupedPredictions[groupName].map((game) => {
                  const shouldRevealPredictions = allUsersPredicted(
                    game.predictions
                  );

                  return (
                    <div key={game.gameId} className="game-predictions">
                      <h4 onClick={() => toggleVisibility(game.gameId)}>
                        <span>
                          {game.team1} vs {game.team2}
                        </span>
                        <span className="nat-span">
                          <img
                            src={getFlagUrl(game.team1)}
                            alt={game.team1}
                            className="flag-icon"
                          />{" "}
                          vs{" "}
                          <img
                            src={getFlagUrl(game.team2)}
                            alt={game.team2}
                            className="flag-icon"
                          />
                        </span>
                      </h4>
                      {visibleGroups[game.gameId] &&
                        (shouldRevealPredictions ? (
                          <div className="predictions-grid">
                            <div className="grid-header">User</div>
                            <div className="grid-header">Date</div>
                            <div className="grid-header">Team 1</div>
                            <div className="grid-header">Score</div>
                            <div className="grid-header">Team 2</div>
                            <div className="grid-header">Outcome</div>
                            {game.predictions.map((prediction) => (
                              <React.Fragment key={prediction._id}>
                                <div className="grid-item">
                                  {prediction.userId.userName}
                                </div>
                                <div className="grid-item">
                                  {prediction.date}
                                </div>
                                <div className="grid-item">
                                  {prediction.team1}
                                </div>
                                <div className="grid-item">
                                  {prediction.team1Score} -{" "}
                                  {prediction.team2Score}
                                </div>
                                <div className="grid-item">
                                  {prediction.team2}
                                </div>
                                <div className="grid-item">
                                  {prediction.predictedOutcome === "team1"
                                    ? prediction.team1
                                    : prediction.predictedOutcome === "team2"
                                    ? prediction.team2
                                    : "Draw"}
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        ) : (
                          <div>
                            Predictions will be revealed one hour before the
                            match or when all users have submitted their
                            predictions.
                          </div>
                        ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default FinalPredictions;
