import React, { useEffect, useState } from "react";
import "./Chat.css";
import ChatSideBar from "../../components/ChatSidebar/ChatSideBar";
import { useSelector } from "react-redux";
import axios from "axios";
import ChatBox from "../../components/ChatBox/ChatBox";
import CreateGroupPopup from "../../components/CreateGroupPopUp/CreateGroupPopUp";
import GroupDetailsPopUp from "../../components/GroupDetails/GroupDetailsPopUp";

const ChatPage = () => {
  const currentActiveChat = useSelector((res) => res.chat.currentActiveChat);
  const token = useSelector((res) => res.auth.token);
  const [chat, setChat] = useState({});
  const [isCreateGroup, setIsCreateGroup] = useState(false);
  const [isGroupDetailsPopUp, setIsGroupDetailsPopUp] = useState(false);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/chat/getChat/${currentActiveChat}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChat(res.data.chat);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (currentActiveChat) {
      fetchChat();
    }
  }, [currentActiveChat, token]);

  return (
    <div className={`chat-container ${isCreateGroup ? "blurred" : ""}`}>
      {isCreateGroup && (
        <CreateGroupPopup setIsCreateGroup={setIsCreateGroup} />
      )}
      <ChatSideBar setIsCreateGroup={setIsCreateGroup} />
      {isGroupDetailsPopUp && (
        <GroupDetailsPopUp
          setIsGroupDetailsPopUp={setIsGroupDetailsPopUp}
          chat={chat}
        />
      )}
      <ChatBox chat={chat} setIsGroupDetailsPopUp={setIsGroupDetailsPopUp} />
    </div>
  );
};

export default ChatPage;
