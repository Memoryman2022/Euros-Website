// src/pages/UpdateRoundOf16.jsx
import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function UpdateRoundOf16({ onUpdate }) {
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    try {
      const response = await axios.post(`${API_URL}/knockout/roundOf16/update`);
      setMessage(response.data);
      if (onUpdate) onUpdate();
    } catch (error) {
      setMessage("Error updating round of 16 games");
      console.error("Error updating round of 16 games:", error);
    }
  };

  return (
    <div className="update-round-of-16-container">
      <h2>Update Round of 16 Games</h2>
      <button onClick={handleUpdate}>Update Games</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UpdateRoundOf16;
