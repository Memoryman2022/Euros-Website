import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import getFlagUrl from "../utils/getFlagUrl";
import { parse, differenceInMilliseconds, isAfter, isValid } from "date-fns";
import "../Css/FinalPredictions.css";

const getFullGroupName = (gameId) => {
  const group = gameId.split("-")[0]; // Extract the group part from the gameId
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

const ONE_HOUR = 60 * 60 * 1000; // One hour in milliseconds

const FinalPredictions = () => {
  const [groupedPredictions, setGroupedPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight
  );
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 500);
  const [visiblePredictions, setVisiblePredictions] = useState({});

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
      setGroupedPredictions(response.data || []);
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

  const toggleVisibility = (gameId) => {
    setVisiblePredictions((prev) => ({
      ...prev,
      [gameId]: !prev[gameId],
    }));
  };

  const isOneHourBeforeMatch = (startTime) => {
    console.log(`Parsing startTime: ${startTime}`);
    const matchStartTime = parse(
      `${startTime} ${new Date().getFullYear()}`,
      "dd MMM HH:mm yyyy",
      new Date()
    );
    console.log(`Parsed matchStartTime: ${matchStartTime}`);

    if (!isValid(matchStartTime)) {
      console.log(`Invalid match date: ${startTime}`);
      return false;
    }

    const currentTime = new Date();
    console.log(`Current Time: ${currentTime}`);

    const timeDifference = differenceInMilliseconds(
      matchStartTime,
      currentTime
    );
    console.log(`Time Difference: ${timeDifference} milliseconds`);

    const isOneHourBeforeMatch =
      timeDifference <= ONE_HOUR && timeDifference >= 0;
    console.log(`Is One Hour Before Match: ${isOneHourBeforeMatch}`);

    const hasMatchPassed = currentTime >= matchStartTime;
    console.log(`Has Match Passed: ${hasMatchPassed}`);

    console.log(
      `Frontend Time Check - Match Time: ${matchStartTime}, Now: ${currentTime}, Time Diff: ${timeDifference}, Is One Hour Before Match: ${isOneHourBeforeMatch}, Has Match Passed: ${hasMatchPassed}`
    );
    return isOneHourBeforeMatch || hasMatchPassed;
  };

  const allUsersPredicted = (predictions) => {
    const TOTAL_USERS = 14; // Update this to the correct number of users
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
        have submitted their predictions for a given match. Click the Fixture to
        reveal.
      </div>
      {Array.isArray(groupedPredictions) && groupedPredictions.length > 0 ? (
        groupedPredictions.map((game) => {
          const gameDate = game.startTime; // Use startTime consistently
          if (!gameDate) {
            console.error(
              `Missing startTime for game: ${JSON.stringify(game)}`
            );
            return null;
          }
          const shouldRevealPredictions =
            isOneHourBeforeMatch(gameDate) ||
            allUsersPredicted(game.predictions);

          console.log(
            `Game ${game.gameId} - Should Reveal Predictions: ${shouldRevealPredictions}`
          );

          return (
            <div key={game.gameId} className="game-predictions">
              <h3 onClick={() => toggleVisibility(game.gameId)}>
                <span>{getFullGroupName(game.gameId)}</span>
                <span className="nat-span">
                  <img
                    src={getFlagUrl(game.team1)}
                    alt={game.team1}
                    className="flag-icon"
                  />{" "}
                  {game.team1} vs {game.team2}{" "}
                  <img
                    src={getFlagUrl(game.team2)}
                    alt={game.team2}
                    className="flag-icon"
                  />
                </span>
              </h3>
              {visiblePredictions[game.gameId] &&
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
                        <div className="grid-item">{prediction.date}</div>
                        <div className="grid-item">{prediction.team1}</div>
                        <div className="grid-item">
                          {prediction.team1Score} - {prediction.team2Score}
                        </div>
                        <div className="grid-item">{prediction.team2}</div>
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
                    Predictions will be revealed one hour before the match or
                    when all users have submitted their predictions.
                  </div>
                ))}
            </div>
          );
        })
      ) : (
        <div>No predictions available.</div>
      )}
    </div>
  );
};

export default FinalPredictions;
