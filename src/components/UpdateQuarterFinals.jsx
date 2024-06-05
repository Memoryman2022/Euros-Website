import React from "react";
import axios from "axios";
import { API_URL } from "../config";

const UpdateQuarterFinals = ({ onUpdate }) => {
  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/knockout/quarterfinalgames/update`
      );
      alert(response.data.message);
      if (onUpdate) onUpdate();
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
