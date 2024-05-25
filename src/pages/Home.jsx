import React, { useState, useEffect, useRef } from "react";
import MessageInput from "../components/MessageInput";
import Leaderboard from "../pages/Leaderboard";
import ConfirmedPredictions from "../components/ConfirmedPredictions";
import Tabs from "../components/Tabs";
import "../Css/Home.css";
import { fetchUserDetails, fetchMessages, createMessage } from "../api";
import { API_URL } from "../config/index";
import socket from "../utils/socket";

function Home() {
  const [userDetails, setUserDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const feedEndRef = useRef(null);
  const messageIds = useRef(new Set());

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

  const fetchAndSetMessages = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const data = await fetchMessages(token);
      // Update messages and track unique message IDs
      setMessages(data);
      messageIds.current = new Set(data.map((message) => message._id));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchAndSetUserDetails();
    fetchAndSetMessages();

    // Listen for new messages
    socket.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => {
        if (!messageIds.current.has(newMessage._id)) {
          messageIds.current.add(newMessage._id);
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  useEffect(() => {
    if (feedEndRef.current) {
      feedEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleNewMessage = async (content) => {
    const token = localStorage.getItem("jwtToken");
    try {
      const newMessage = await createMessage(content, token);
      if (!messageIds.current.has(newMessage._id)) {
        setMessages((prevMessages) => {
          messageIds.current.add(newMessage._id);
          return [...prevMessages, newMessage];
        });
        socket.emit("newMessage", newMessage); // Emit
      }
    } catch (error) {
      console.error("Error creating message:", error);
    }
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
                src={`${API_URL.replace("/api", "")}${
                  userDetails.profileImage
                }`}
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
            {messages.map((message) => (
              <div key={message._id} className="feed-item">
                <img
                  src={`${API_URL.replace("/api", "")}${message.profileImage}`}
                  alt="Profile"
                  className="message-profile-pic"
                />
                {message.content}
              </div>
            ))}
            <div ref={feedEndRef} />
          </div>

          <MessageInput onMessageSend={handleNewMessage} />
        </div>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
}

export default Home;
