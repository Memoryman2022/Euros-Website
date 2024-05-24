import React, { useState, useEffect, useRef } from "react";
import MessageInput from "../components/MessageInput";
import Leaderboard from "../pages/Leaderboard";
import ConfirmedPredictions from "../components/ConfirmedPredictions";
import Tabs from "../components/Tabs";
import "../Css/Home.css";
import { fetchUserDetails } from "../api";

function Home() {
  const [userDetails, setUserDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const feedEndRef = useRef(null);

  const fetchAndSetUserDetails = async () => {
    const token = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      setLoading(true);
      try {
        const data = await fetchUserDetails(userId, token);
        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
    setIsMounted(true);
    fetchAndSetUserDetails();
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("messages", JSON.stringify(messages));
    }
  }, [messages, isMounted]);

  useEffect(() => {
    if (feedEndRef.current) {
      feedEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleNewMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const tabs = [
    { label: "Confirmed Predictions", content: <ConfirmedPredictions /> },
    { label: "Leaderboard", content: <Leaderboard /> },
  ];

  return (
    <div className="home-container">
      <div className="main-content-home">
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
                <img
                  src={`http://localhost:5005${message.profileImage}`}
                  alt="Profile"
                  className="message-profile-pic"
                />
                {message.text}
              </div>
            ))}
            <div ref={feedEndRef} />
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
