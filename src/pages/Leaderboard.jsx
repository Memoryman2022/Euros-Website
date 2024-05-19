import React, { useEffect, useState } from "react";
import "../Css/Leaderboard.css";
import { fetchUsers } from "../api";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [previousUsers, setPreviousUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers();

        //sort users by score
        const sortedUsers = fetchedUsers.sort((a, b) => b.score - a.score);

        //assign positions
        const usersWithPositions = sortedUsers.map((user, index) => ({
          position: index + 1,
          name: user.userName,
          score: user.score || 0,
        }));

        //Tracl positions
        const updatedUsers = usersWithPositions.map((user) => {
          const prevUser = previousUsers.find(
            (prev) => prev.name === user.name
          );
          let movement = "";
          if (prevUser) {
            if (user.position < prevUser.position) {
              movement = "up";
            } else if (user.position > prevUser.position) {
              movement = "down";
            }
          }
          return { ...user, movement };
        });

        setUsers(usersWithPositions);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    getUsers();
  }, []);

  return (
    <div className="leaderboard-page">
      <h2>Leaderboard</h2>
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
                <td className="position">{user.position}.</td>
                <td className="name">
                  {user.name}
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
