import React, { useState } from "react";
import "./Sidebar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ListComponent from "../ListComponent/ListComponent";

const Sidebar = ({ user }) => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState("");
  const [listData, setListData] = useState([]);
  const [activeLink, setActiveLink] = useState("");

  // Log Out Handler
  const handleLogOut = () => {
    axios
      .post(
        "http://localhost:4000/api/auth/logOut",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Added token header
          },
        }
      )
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.error("Error in logging out:", err);
      });
  };

  // View Profile Handler
  const handleViewProfile = () => {
    navigate(`/profile/${user._id}`);
  };

  const handleFetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/user/getAllRequests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setListData(res.data.requests);
      setCurrentState("requests");

      console.log("requests:" + listData.length);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleFetchFriends = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/user/getAllFriends",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setListData(res.data.friends);
      setCurrentState("friends");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="sidebar">
      {/* Header Section */}
      <div className="sidebar-header">
        <img
          src={`http://localhost:4000/public/${user.avatar}`} // Dynamic URL with fallback
          alt="User Profile"
          className="sidebar-profile-pic"
          onClick={handleViewProfile}
        />
        <h2 className="sidebar-name">{user?.userName || "User"}</h2>{" "}
        {/* Fallback for userName */}
      </div>

      {/* Navigation Links */}
      <div className="sidebar-links">
        <span
          className={`sidebar-link ${
            activeLink === "requests" ? "active" : ""
          }`}
          onClick={handleFetchRequests}
        >
          Requests
        </span>
        <span
          className={`sidebar-link ${activeLink === "friends" ? "active" : ""}`}
          onClick={handleFetchFriends}
        >
          Friends
        </span>
      </div>

      {/* Info Section */}
      <div className="sidebar-info">
        {listData.length === 0 ? (
          <>
            <h3>Start Matching</h3>
            <p>
              Matches will appear here once you start to like people. You can
              message them directly from here when you're ready to spark up the
              conversation.
            </p>
          </>
        ) : (
          listData.map((data, index) => (
            <ListComponent
              key={index}
              currentState={currentState}
              data={data}
            />
          ))
        )}
      </div>

      {/* Log Out Button */}
      <div className="logout-section">
        <button className="logout-button" onClick={handleLogOut}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
