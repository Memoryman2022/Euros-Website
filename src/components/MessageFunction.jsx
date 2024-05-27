import React, { useState, useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import { fetchMessages, createMessage } from "../api";
import { API_URL } from "../config/index";
import socket from "../utils/socket";
import "../Css/MessageFunction.css";

const MessageFunction = ({ userDetails }) => {
  const [messages, setMessages] = useState([]);
  const feedRef = useRef(null);
  const messageIds = useRef(new Set());
  const fetchTimeoutRef = useRef(null);

  const fetchAndSetMessages = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const data = await fetchMessages(token);
      const sortedMessages = data.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setMessages(sortedMessages);
      messageIds.current = new Set(data.map((message) => message._id));
      if (feedRef.current) {
        feedRef.current.scrollTop = feedRef.current.scrollHeight;
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchAndSetMessages();

    // Listen for new messages
    socket.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => {
        if (!messageIds.current.has(newMessage._id)) {
          messageIds.current.add(newMessage._id);
          const updatedMessages = [...prevMessages, newMessage].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          return updatedMessages;
        }
        return prevMessages;
      });
      if (feedRef.current) {
        feedRef.current.scrollTop = feedRef.current.scrollHeight;
      }

      // Clear any existing timeout
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }

      // Set a timeout to fetch messages after 2 seconds
      fetchTimeoutRef.current = setTimeout(() => {
        fetchAndSetMessages();
      }, 2000);
    });

    return () => {
      socket.off("newMessage");
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  const handleNewMessage = async (content) => {
    const token = localStorage.getItem("jwtToken");
    try {
      const newMessage = await createMessage(content, token);
      if (!messageIds.current.has(newMessage._id)) {
        messageIds.current.add(newMessage._id);
        socket.emit("newMessage", newMessage); // Emit
      }
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  return (
    <div className="message-function-container">
      <h4>CHAT</h4>
      <div className="feed-items" ref={feedRef}>
        {messages.map((message) => (
          <div key={message._id} className="feed-item">
            <div className="message-header">
              <span className="username">{message.user.userName}</span>
              <img
                src={`${API_URL.replace("/api", "")}${message.profileImage}`}
                alt="Profile"
                className="message-profile-pic"
              />
            </div>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
      </div>
      <MessageInput onMessageSend={handleNewMessage} />
    </div>
  );
};

export default MessageFunction;
