import React, { useState, useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import { fetchMessages, createMessage } from "../api";
import { API_URL } from "../config/index";
import socket from "../utils/socket";
import "../Css/MessageFunction.css";

const MessageFunction = ({ userDetails }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const feedRef = useRef(null);
  const messageIds = useRef(new Set());

  const fetchAndSetMessages = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const data = await fetchMessages(token);
      const sortedMessages = data.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setMessages(sortedMessages);
      messageIds.current = new Set(data.map((message) => message._id));
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
          return [...prevMessages, newMessage].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        }
        return prevMessages;
      });
    });

    const intervalId = setInterval(() => {
      fetchAndSetMessages();
    }, 5000);

    return () => {
      socket.off("newMessage");
      clearInterval(intervalId);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="message-function-container">
      <h4>CHAT</h4>
      <div className="feed-items" ref={feedRef}>
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
      </div>
      <MessageInput onMessageSend={handleNewMessage} />
    </div>
  );
};

export default MessageFunction;
