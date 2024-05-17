import React, { useState } from "react";
import "../Css/Home.css";
import MessageInput from "../components/MessageInput";

function Home() {
  const [messages, setMessages] = useState([]);

  const handleNewMessage = (newMessage) => {
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
  };

  return (
    <div className="home-container">
      <div className="user-details">
        <div className="profile-pic">
          <img src="/path/to/profile-pic.jpg" alt="Profile" />
        </div>
        <div className="user-info">
          <div className="user-info-item">
            <span className="label">Name:</span>
            <span className="value">John Doe</span>
          </div>
          <div className="user-info-item">
            <span className="label">Score:</span>
            <span className="value">1234</span>
          </div>
          <div className="user-info-item">
            <span className="label">Position:</span>
            <span className="value">1st</span>
          </div>
        </div>
      </div>
      <div className="social-feed">
        <h2>CHAT</h2>
        <div className="feed-items">
          {messages.map((message, index) => (
            <div key={index} className="feed-item">
              {message}
            </div>
          ))}
        </div>
        <MessageInput onMessageSend={handleNewMessage} />
      </div>
    </div>
  );
}

export default Home;
