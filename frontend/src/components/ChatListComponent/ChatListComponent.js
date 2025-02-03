import React, { useState, useEffect } from "react";
import "./ChatListComponent.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateCurrentActiveChat,
  updateCurrentActiveChatName,
} from "../../utils/ChatSlice";

const ChatListComponent = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const currentLoginUser = useSelector((res) => res.auth.user);
  const [chatName, setChatName] = useState("");

  useEffect(() => {
    if (data.isGroup) {
      setChatName(data.chatName || "Group Chat");
    } else {
      const otherUser = data.users.find(
        (user) => user._id !== currentLoginUser._id
      );
      setChatName(otherUser?.userName || "No Active Chat");
    }
  }, [data, currentLoginUser, dispatch]);

  const handleCurrentState = (id) => {
    dispatch(updateCurrentActiveChat(id));
    dispatch(updateCurrentActiveChatName(chatName));
    navigate();
  };

  return (
    <div className="chat-item" onClick={() => handleCurrentState(data._id)}>
      <img
        src={
          `http://localhost:4000/public/${data.avatar}` || "/default-avatar.png"
        }
        alt={chatName || "Chat User"}
        className="chat-avatar"
      />
      <span className="chat-name">
        {typeof chatName === "string" ? chatName : "No Active Chat"}
      </span>
    </div>
  );
};

export default ChatListComponent;
