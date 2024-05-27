import React, { useState, useEffect } from "react";
import { fetchUsers, updateUserScores } from "../api";
import { API_URL } from "../config/index";
import "../Css/Leaderboard.css";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [previousUsers, setPreviousUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers();

        // Sort users by score in descending order
        const sortedUsers = fetchedUsers.sort((a, b) => b.score - a.score);

        // Assign positions based on sorted scores
        const usersWithPositions = sortedUsers.map((user, index) => ({
          ...user,
          position: index + 1,
          movement: user.movement, // Get movement from backend
        }));

        setPreviousUsers(usersWithPositions);
        setUsers(usersWithPositions);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers();
  }, []);

  const randomizeScores = async () => {
    const updatedUsers = users.map((user) => ({
      ...user,
      score: Math.floor(Math.random() * 100),
    }));

    // Update user scores in the backend
    try {
      await updateUserScores(updatedUsers);
      // Fetch updated users from the backend to get new positions
      const fetchedUsers = await fetchUsers();

      // Sort the updated users by their new scores
      const sortedUsers = fetchedUsers.sort((a, b) => b.score - a.score);

      // Determine the movement
      const usersWithMovement = sortedUsers.map((user, index) => {
        const prevUser = previousUsers.find((prev) => prev._id === user._id);
        let movement = "";
        if (prevUser) {
          if (index + 1 < prevUser.position) {
            movement = "up";
          } else if (index + 1 > prevUser.position) {
            movement = "down";
          }
        }
        return { ...user, position: index + 1, movement };
      });

      setPreviousUsers(usersWithMovement);
      setUsers(usersWithMovement);
    } catch (error) {
      console.error("Error updating scores:", error);
    }
  };

  return (
    <div className="leaderboard-page">
      <h4>Leaderboard</h4>
      <button className="leadbrd-btn" onClick={randomizeScores}>
        Random Scores
      </button>
      <div className="leaderboard-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th className="position">Position</th>
              <th className="name">Name</th>
              <th className="score">Score</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td className="position">{user.position}</td>
                <td className="name">
                  <img
                    src={`${API_URL.replace("/api", "")}${user.profileImage}`}
                    alt="Profile"
                    className="profile-pic"
                  />
                  {user.userName}
                  {user.movement === "up" && (
                    <img src="/up.svg.png" alt="Up" className="movement-icon" />
                  )}
                  {user.movement === "down" && (
                    <img
                      src="/down.svg.png"
                      alt="Down"
                      className="movement-icon"
                    />
                  )}
                </td>
                <td className="score">{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
