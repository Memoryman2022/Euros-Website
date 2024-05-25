// src/components/MessageInput.jsx
import React, { useState } from "react";
import "../Css/MessageInput.css";

function MessageInput({ onMessageSend }) {
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      onMessageSend(message);
      setMessage(""); // Clear the input field
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline from being added
      handleSendMessage();
    }
  };

  return (
    <div className="message-input-container">
      <textarea
        placeholder="Type your message..."
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        rows="3"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default MessageInput;
