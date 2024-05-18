import React, { useState, useEffect } from "react";
import "../Css/Home.css";
import MessageInput from "../components/MessageInput";

function Home() {
  const [messages, setMessages] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // Retrieve messages from localStorage when the component mounts
  useEffect(() => {
    const storedMessages = localStorage.getItem("messages");
    console.log("Retrieved messages from localStorage:", storedMessages);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
    setIsMounted(true);
  }, []);

  // Update localStorage whenever messages change
  useEffect(() => {
    if (isMounted) {
      console.log("Saving messages to localStorage:", messages);
      localStorage.setItem("messages", JSON.stringify(messages));
    }
  }, [messages, isMounted]);

  const handleNewMessage = (newMessage) => {
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
  };

  return (
    <div className="home-container">
      <div className="user-details">
        <div className="profile-pic">
          <img src="/profile-pic.jpg" alt="Profile" />
        </div>
        <div className="user-info">
          <div className="user-info-item">
            <span className="label">Name:</span>
            <span className="value">Robert Cannon</span>
          </div>
          <div className="user-info-item">
            <span className="label">Position:</span>
            <span className="value">1st</span>
          </div>
          <div className="user-info-item">
            <span className="label">Score:</span>
            <span className="value">12</span>
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
