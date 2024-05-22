import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { fetchUserDetails } from "../api";
import "../Css/Home.css";
import MessageInput from "../components/MessageInput";
import Leaderboard from "../pages/Leaderboard";
import ConfirmedPredictions from "../components/ConfirmedPredictions";
import Tabs from "../components/Tabs";

function Home() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const feedItemsRef = useRef(null); // Add a ref to the feed-items container

  const fetchAndSetUserDetails = async () => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const data = await fetchUserDetails(userId, token);
        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  // Retrieve messages from localStorage when the component mounts
  useEffect(() => {
    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
    setIsMounted(true);
    fetchAndSetUserDetails(); // Initial fetch
  }, [userId]);

  // Update localStorage whenever messages change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("messages", JSON.stringify(messages));
      // Scroll to the bottom when messages change
      if (feedItemsRef.current) {
        feedItemsRef.current.scrollTop = feedItemsRef.current.scrollHeight;
      }
    }
  }, [messages, isMounted]);

  const handleNewMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]); // Append new message to the end
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const tabs = [
    { label: "Confirmed Predictions", content: <ConfirmedPredictions /> },
    {
      label: "Leaderboard",
      content: <Leaderboard onUsersUpdated={fetchAndSetUserDetails} />,
    },
  ];

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
          <div className="feed-items" ref={feedItemsRef}>
            {messages.map((message, index) => (
              <div key={index} className="feed-item">
                <img
                  src={`http://localhost:5005${message.profileImage}`}
                  alt="Profile"
                  className="message-profile-pic"
                />
                {message.text}
              </div>
            ))}
          </div>

          <MessageInput
            onMessageSend={handleNewMessage}
            userProfileImage={userDetails?.profileImage}
          />
        </div>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
}

export default Home;
