import React from "react";
import axios from "axios";
import { API_URL } from "../config";

const UpdateFinals = ({ onUpdate }) => {
  const handleUpdate = async () => {
    try {
      const response = await axios.post(`${API_URL}/finalgames/update`);
      alert(response.data.message);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating final games:", error);
      alert("Failed to update final games.");
    }
  };

  return (
    <button onClick={handleUpdate} className="update-button">
      Update Final Games
    </button>
  );
};

export default UpdateFinals;
