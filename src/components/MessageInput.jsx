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

  return (
    <div className="message-input-container">
      <textarea
        placeholder="Type your message..."
        value={message}
        onChange={handleInputChange}
        rows="10" // Set the number of rows to approximately 20
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default MessageInput;
