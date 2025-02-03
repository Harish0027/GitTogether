import React from "react";
import "./UserProfileCard.css";
import axios from "axios";
import { useSelector } from "react-redux";

const UserProfileCard = ({ user, onRequestSent }) => {
  const token = useSelector((state) => state.auth.token);

  const handleInterested = async () => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/request/sendRequest/interasted/${user._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        console.log("Connection request sent successfully!");
        onRequestSent(); // Refresh feed after sending the request
      }
    } catch (error) {
      console.error("Error sending interest request:", error.message);
    }
  };

  const handleIgnored = async () => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/request/sendRequest/ignore/${user._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        console.log("Connection request ignored successfully!");
        onRequestSent(); // Refresh feed after ignoring the request
      }
    } catch (error) {
      console.error("Error ignoring request:", error.message);
    }
  };

  if (!user) {
    return <p className="loading">Fetching user details...</p>;
  }

  return (
    <div className="myFeeds-profile-card">
      <img
        src={user.profilePic || "https://via.placeholder.com/300"}
        alt={user.userName || "User"}
        className="profile-card-image"
      />
      <div className="profile-card-info">
        <h2 className="profile-card-name">
          {user.userName} <span className="profile-card-age">{user.age}</span>
          {user.badge && <span className="profile-card-badge">✔️</span>}
        </h2>
        <div className="profile-card-tags">
          {user.interests?.map((interest, index) => (
            <span key={index} className="tag">
              {interest}
            </span>
          ))}
        </div>
      </div>
      <div className="profile-card-actions">
        <button className="btn rewind">🔄</button>
        <button className="btn nope" onClick={handleIgnored}>
          ❌
        </button>
        <button className="btn like" onClick={handleInterested}>
          💚
        </button>
        <button className="btn super-like">⚡</button>
      </div>
    </div>
  );
};

export default UserProfileCard;
