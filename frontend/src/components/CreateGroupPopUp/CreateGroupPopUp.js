import React, { useState } from "react";
import axios from "axios";
import "./group.css";
import { useSelector } from "react-redux";

const CreateGroupPopup = ({ setIsCreateGroup }) => {
  const [groupName, setGroupName] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [users, setUsers] = useState([]);
  const token = useSelector((res) => res.auth.token);
  const currentLoginUser = useSelector((res) => res.auth.user);

  const handleSearchUsers = async (e) => {
    const value = e.target.value;
    setSearchUser(value);

    if (value.trim()) {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/user/searchUser?userName=${encodeURIComponent(
            value
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserSuggestions(res.data.users || []);
      } catch (error) {
        console.error("User search failed:", error);
      }
    } else {
      setUserSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/chat/createGroup",
        {
          users,
          chatName: groupName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        alert(`Group "${groupName}" created successfully!`);
        setGroupName("");
        setUsers([]);
        setSearchUser("");
        setUserSuggestions([]);
      }
    } catch (error) {
      console.error("Group creation failed:", error.message);
    }
  };
  const pushUserIntoArray = (user) => {
    setUsers((prevUsers) => {
      if (prevUsers.some((u) => u._id === user._id)) {
        alert("User already in list!!!");
        return prevUsers; // Return the existing array to prevent updates
      } else {
        return [...prevUsers, user]; // Add new user to the array
      }
    });
  };

  const removeUser = (user) => {
    setUsers((prevUsers) =>
      prevUsers.filter((listUser) => listUser._id !== user._id)
    );
  };

  return (
    <div className="create-group-popUp">
      <form className="create-group-container" onSubmit={handleSubmit}>
        <div className="create-group-title">
          <h2>Create Group</h2>
          <span onClick={() => setIsCreateGroup(false)}>✕</span>
        </div>

        <div className="create-group-inputs">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />

          <input
            type="search"
            placeholder="Search User"
            value={searchUser}
            onChange={(e) => handleSearchUsers(e)}
          />

          {userSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {userSuggestions.map((user) => (
                <li key={user._id} onClick={() => pushUserIntoArray(user)}>
                  {user.userName}
                </li>
              ))}
            </ul>
          )}

          {users.length > 0 && (
            <ul className="users-list">
              {users.map((user) => (
                <>
                  <li>{user.userName}</li>
                  <span onClick={() => removeUser(user)}>X</span>
                </>
              ))}
            </ul>
          )}
        </div>

        <button type="submit">Create Group</button>
      </form>
    </div>
  );
};

export default CreateGroupPopup;
