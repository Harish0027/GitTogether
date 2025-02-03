import React, { useEffect, useState } from "react";
import "./ChatSideBar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ChatListComponent from "../ChatListComponent/ChatListComponent";

const ChatSideBar = ({ setIsCreateGroup }) => {
  const currentLoginUser = useSelector((res) => res.auth.user);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState("");
  const [listData, setListData] = useState([]);

  // Logout Handler
  const handleLogOut = () => {
    axios
      .post(
        "http://localhost:4000/api/auth/logOut",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => navigate("/"))
      .catch((err) => console.error("Error in logging out:", err));
  };

  // Navigate to Create Group
  const handleCreateGroup = () => {
    setIsCreateGroup(true);
  };

  // Fetch Chats
  const fetchChats = async () => {
    const endpoint =
      currentState === "chatGroups"
        ? "http://localhost:4000/api/chat/fetchAllGroupChat"
        : "http://localhost:4000/api/chat/fetchAllFriendsChat";

    try {
      const res = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setListData(res.data.chats);
    } catch (error) {
      console.error("Failed to fetch chats:", error.stack);
    }
  };

  // Fetch Chats on State Change
  useEffect(() => {
    if (currentState) fetchChats();
  }, [currentState, token]);

  // State Handlers
  const handleFetchFriends = () => {
    setCurrentState("chatFriends");
  };

  const handleFetchGroups = () => {
    setCurrentState("chatGroups");
  };

  return (
    <div className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={`http://localhost:4000/public/${currentLoginUser.avatar}`}
            alt="User Profile"
            className="sidebar-profile-pic"
          />
          <h2 className="sidebar-name">
            {currentLoginUser.userName || "User"}
          </h2>
        </div>

        {/* Create Group Section */}
        <div className="create-group-section">
          <button className="create-group-button" onClick={handleCreateGroup}>
            Create Group
          </button>
          <span>
            <i className="fa-solid fa-plus"></i>
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="sidebar-links">
        <span className={`sidebar-link `} onClick={handleFetchGroups}>
          Groups
        </span>
        <span className={`sidebar-link `} onClick={handleFetchFriends}>
          Friends
        </span>
      </div>

      {/* Info Section */}
      <div className="sidebar-info">
        {listData.length === 0 ? (
          <>
            <h3>Start Messaging</h3>
            <p>
              Your chats will appear here. Add friends or join groups to start
              messaging and stay connected.
            </p>
          </>
        ) : (
          listData.map((data, index) => (
            <ChatListComponent
              key={index}
              currentState={currentState}
              data={data}
            />
          ))
        )}
      </div>

      {/* Logout Section */}
      <div className="logout-section">
        <button className="logout-button" onClick={handleLogOut}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ChatSideBar;
