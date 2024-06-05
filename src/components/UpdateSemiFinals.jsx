import React from "react";
import axios from "axios";
import { API_URL } from "../config";

const UpdateSemiFinals = ({ onUpdate }) => {
  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/knockout/semifinalgames/update`
      );
      alert(response.data.message);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating semi-final games:", error);
      alert("Failed to update semi-final games.");
    }
  };

  return (
    <button onClick={handleUpdate} className="update-button">
      Update Semi-Final Games
    </button>
  );
};

export default UpdateSemiFinals;
