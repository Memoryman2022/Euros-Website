import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchUserDetails } from "../api";
import "../Css/Home.css";
import MessageInput from "../components/MessageInput";
import Leaderboard from "../pages/Leaderboard";

function Home() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  // Retrieve messages from localStorage when the component mounts
  useEffect(() => {
    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
    setIsMounted(true);

    // Fetch user details
    const token = localStorage.getItem("token"); // Assuming you store the token in localStorage after login
    if (token) {
      fetchUserDetails(userId, token)
        .then((data) => {
          console.log("Fetched user details:", data);
          setUserDetails(data);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, [userId]);

  // Update localStorage whenever messages change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("messages", JSON.stringify(messages));
    }
  }, [messages, isMounted]);

  const handleNewMessage = (newMessage) => {
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
  };

  return (
    <div className="home-container">
      <div className="main-content">
        <div className="user-details">
          <div className="profile-pic-home">
            {userDetails && (
              <img
                src={`http://localhost:5005${userDetails.profileImage}`}
                alt="Profile"
              />
            )}
          </div>
          <div className="user-info">
            <div className="user-info-item">
              <span className="label">Name:</span>
              <span className="value">
                {userDetails ? userDetails.userName : "Loading..."}
              </span>
            </div>
            <div className="user-info-item">
              <span className="label">Score:</span>
              <span className="value">
                {userDetails ? userDetails.score : "Loading..."}
              </span>
            </div>
            <div className="user-info-item">
              <span className="label">Position:</span>
              <span className="value">
                {userDetails ? userDetails.position : "Loading..."}
              </span>
            </div>
          </div>
        </div>
        <div className="social-feed">
          <h4>CHAT</h4>
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
      <div className="extra-content">
        <Leaderboard />
      </div>
    </div>
  );
}

export default Home;
