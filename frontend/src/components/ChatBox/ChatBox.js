// ChatBox.js
import React, { useState, useEffect, useCallback } from "react";
import "./ChatBox.css";
import axios from "axios";
import { useSelector } from "react-redux";
import Message from "../Message/Message";

const ChatBox = ({ chat, setIsGroupDetailsPopUp }) => {
  const [message, setMessage] = useState("");
  const [msgReceived, setMsgReceived] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.auth.user);
  const sigleChat = useSelector((state) => state.chat.currentActiveChatName);
  const [chatName, setChatName] = useState("");

  const fetchReceivedMsg = useCallback(async () => {
    if (!chat?._id) return;

    try {
      const res = await axios.get(
        `http://localhost:4000/api/message/receiveMessage?chatId=${chat._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsgReceived(res.data.message || []);
    } catch (error) {
      console.error(
        "Error fetching messages:",
        error.response?.data || error.message
      );
    }
  }, [chat, token]);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim()) return;

    try {
      await axios.post(
        "http://localhost:4000/api/message/sendMessage",
        { message, chatId: chat?._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("");
      fetchReceivedMsg();
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  }, [message, chat, token, fetchReceivedMsg]);

  useEffect(() => {
    if (!chat) return;
    setChatName(
      chat?.isGroup
        ? chat.chatName || "Group Chat"
        : sigleChat || "No Active Chat"
    );
    fetchReceivedMsg();
  }, [chat, sigleChat, fetchReceivedMsg, chatName]);

  return (
    <main className="chat-content">
      <header
        className="chat-header"
        onClick={() => chat.isGroup && setIsGroupDetailsPopUp(true)}
      >
        <img
          src={chat?.chatProfile || "/default-profile.png"}
          alt={chatName || "Chat User"}
          className="header-profile-pic"
        />
        <span>{chatName || "No Active Chat"}</span>
      </header>

      <div className="chat-messages">
        {msgReceived.length > 0 ? (
          msgReceived.map((msg) => (
            <Message
              key={msg._id}
              sender={msg.sender}
              message={msg.message}
              isSent={msg.sender._id === currentUser._id}
            />
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>

      <footer className="chat-footer">
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </footer>
    </main>
  );
};

export default ChatBox;
