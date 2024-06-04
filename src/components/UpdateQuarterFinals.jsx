import React from "react";
import axios from "axios";
import { API_URL } from "../config";

const UpdateQuarterFinals = () => {
  const handleUpdate = async () => {
    try {
      const response = await axios.post(`${API_URL}/quarterfinals/update`);
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating quarter-final games:", error);
      alert("Failed to update quarter-final games.");
    }
  };

  return (
    <button onClick={handleUpdate} className="update-button">
      Update Quarter-Final Games
    </button>
  );
};

export default UpdateQuarterFinals;
