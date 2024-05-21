import React, { useState } from "react";
import "../Css/MessageInput.css";

function MessageInput({ onMessageSend, userProfileImage }) {
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      onMessageSend({ text: message, profileImage: userProfileImage });
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
        rows="10" // Set the number of rows to approximately 20
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default MessageInput;
