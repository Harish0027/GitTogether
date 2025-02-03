import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./GroupDetailsPopUp.css";
import axios from "axios";

const GroupDetailsPopUp = ({ setIsGroupDetailsPopUp, chat }) => {
  const [currentGroupState, setCurrentGroupState] = useState("overview");
  const [groupUsers, setGroupUsers] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false); // State to show/hide the search bar
  const currentLoginUser = useSelector((state) => state.auth.user);
  const [isCurrentUserLoginAdmin, setIsCurrentUserLoginAdmin] = useState(false);
  const [searchedFriends, setSearchedFriends] = useState([]);
  const [toBeAddUsers, setToBeAddUsers] = useState([]);
  const token = useSelector((res) => res.auth.token);

  // Format the createdAt date
  const formattedDate = new Date(chat.createdAt).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const membersCount = chat.users ? chat.users.length : 0;

  // Function to toggle search bar visibility
  const handleAddMembersClick = () => {
    setShowSearchBar(!showSearchBar);
  };

  const handleDeleteGroupChat = async () => {
    try {
      const res = await axios.delete(
        "http://localhost:4000/api/chat/deleteChat",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            chatId: chat._id,
          },
        }
      );

      alert(res.data.message);
    } catch (error) {
      alert(error.response.data.message);
      console.log("error in deleting the chat ");
    }
  };

  const handleExitGroup = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/user/leaveGroup",
        { chatId: chat._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.message);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/chat/removeFromGroup",
        {
          userId: userId,
          chatId: chat._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        console.log("User removed successfully!");
        // Update group users state after removal
        setGroupUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
      }
    } catch (error) {
      console.log("Error in removing user!!!");
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    const userName = e.target.value.trim();

    if (!userName) {
      setSearchedFriends([]); // Clear search list when input is empty
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:4000/api/user/searchUser?userName=${userName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setSearchedFriends(res.data.users);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const handleAddUser = async (userId) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/user/addUserToGroup",
        { chatId: chat._id, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setGroupUsers((prev) => [...prev, { _id: userId }]);
        alert(res.data.message);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    setGroupUsers(chat.users || []);
    if (currentLoginUser._id.toString() === chat.admin.toString()) {
      setIsCurrentUserLoginAdmin(true);
    }
  }, [chat, groupUsers]);

  return (
    <div className="group-details-container">
      <div className="group-details-sidebar">
        <h2
          className="group-details-sidebar-title"
          onClick={() => setIsGroupDetailsPopUp(false)}
        >
          Group Details
        </h2>
        <ul className="group-details-sidebar-links">
          <li
            onClick={(e) => {
              e.preventDefault();
              setCurrentGroupState("overview");
            }}
          >
            <i className="fa-solid fa-circle-info"></i>
            Overview
          </li>
          <li
            onClick={(e) => {
              e.preventDefault();
              setCurrentGroupState("members");
            }}
          >
            <i className="fa-solid fa-user-group"></i>
            Members
          </li>
        </ul>
      </div>
      <div className="group-details-content">
        <div
          onClick={() => setIsGroupDetailsPopUp(false)}
          className="close-btn"
        >
          X
        </div>
        <div className="group-details-content-c1">
          {currentGroupState === "overview" ? (
            <>
              <img
                className="group-profile"
                src={chat.chatProfile}
                alt="Group Profile"
              />
              <h1>{chat.chatName}</h1>
              <p>{membersCount} Members</p>
              <p>Created on: {formattedDate}</p>
              <p>Description: {chat.description}</p>

              <div className="group-actions">
                <button className="exit-group-btn" onClick={handleExitGroup}>
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>Exit
                  Group
                </button>
                <button
                  className="delete-group-btn"
                  onClick={handleDeleteGroupChat}
                >
                  <i className="fa-solid fa-trash"></i>Delete Group
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>Members ({chat.users.length})</h2>
              <button
                className="add-members-btn"
                onClick={handleAddMembersClick}
              >
                <i className="fa-solid fa-user-plus"></i> Add members
              </button>
              {/* Conditionally render search bar */}
              {showSearchBar && (
                <input
                  type="text"
                  className="search-bar"
                  placeholder="Search users..."
                  onChange={(e) => handleSearch(e)}
                  // Add functionality to search users as needed
                />
              )}
              <ul className="search-user-list">
                {searchedFriends?.length > 0 &&
                  searchedFriends.map((user) => (
                    <li key={user._id}>
                      {user.userName}
                      <i
                        onClick={() => handleAddUser(user._id)}
                        className="fa-solid fa-plus"
                      ></i>
                    </li>
                  ))}
              </ul>
              <ul className="user-list">
                {groupUsers.map((user) => (
                  <li key={user._id}>
                    <img src={user.avatar} alt={user.userName} />
                    <div className="user-list-element">
                      {user._id.toString() === currentLoginUser._id.toString()
                        ? "You"
                        : user.userName}{" "}
                      <span className="isAdmin">
                        {chat.admin.toString() === user._id.toString() ? (
                          <p>admin</p>
                        ) : isCurrentUserLoginAdmin ? (
                          <i
                            className="fa-solid fa-user-minus"
                            onClick={() => handleRemoveUser(user._id)}
                          ></i>
                        ) : null}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsPopUp;



function test() {
  if (true) {
      var x = 30;  // 'x' is accessible anywhere within this function
  }else{
    var x=10;
  }
  console.log(x);  // 30 (x is still accessible here because it's function-scoped)
  
}

test()
