// src/pages/UpdateRoundOf16.jsx
import React from "react";
import axios from "axios";
import { API_URL } from "../config";

function UpdateRoundOf16({ onUpdate }) {
  const handleUpdate = async () => {
    try {
      const response = await axios.post(`${API_URL}/roundOf16/update`);
      alert(response.data.message);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating round of 16 games:", error);
      alert("Failed to update round of 16 games.");
    }
  };

  return (
    <div className="update-round-of-16-container">
      <h2>Update Round of 16 Games</h2>
      <button onClick={handleUpdate}>Update Games</button>
    </div>
  );
}

export default UpdateRoundOf16;
