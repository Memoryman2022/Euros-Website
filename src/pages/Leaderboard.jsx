import React, { useState } from "react";
import "../Css/Leaderboard.css";

function Leaderboard() {
  // Initialize 15 empty rows
  const initialUsers = Array.from({ length: 15 }, (_, index) => ({
    position: index + 1,
    name: "",
    score: "",
  }));

  const [users, setUsers] = useState(initialUsers);

  return (
    <div className="leaderboard-page">
      <h2>Leaderboard</h2>
      <div className="leaderboard-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.position}</td>
                <td>{user.name}</td>
                <td>{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
