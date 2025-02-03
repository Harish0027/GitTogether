import React, { useEffect, useState } from "react";
import "./ListComponent.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCurrentActiveChat,
  updateCurrentActiveChatName,
} from "../../utils/ChatSlice";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const ListComponent = ({ data, currentState }) => {
  const navigate = useNavigate();
  const token = useSelector((res) => res.auth.token);
  const disPatch = useDispatch();
  const [toUser, setToUser] = useState({});
  const currentUser = useSelector((res) => res.auth.user);

  useEffect(() => {
    if (data.fromUser._id?.toString() === currentUser._id?.toString()) {
      setToUser(data.toUser);
      console.log("current", currentUser);
    } else {
      setToUser(data.fromUser);
    }
  }, [data, currentUser]);

  console.log(token);
  const handleAcceptReqest = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/request/reviewRequest/accepted/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data.message);
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log(data);

  const handleRejectReqest = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/request/reviewRequest/rejected/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data.message);
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleCreateChat = async () => {
    try {
      console.log(data.fromUser);
      const res = await axios.post(
        "http://localhost:4000/api/chat/accessChat",
        {
          user: toUser,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const chat = res.data.chat;
      disPatch(updateCurrentActiveChat(chat._id));
      disPatch(updateCurrentActiveChatName(toUser.userName));
      navigate(`/chat/${chat._id}`);
    } catch (error) {
      console.log("Failed to create Chat!!!");
    }
  };

  const handleVisitProfile = (data) => {
    if (currentUser._id.toString() === data.toUser._id.toString()) {
      navigate(`/profile/${data.fromUser._id}`);
    } else {
      navigate(`/profile/${data.toUser._id}`);
    }
  };

  return (
    <div className="data-item">
      <img
        src={
          `http://localhost:4000/public/${data.toUser.avatar}` ||
          "default-avatar.png"
        } // Dynamic URL with fallback
        alt={data.userName}
        className="data-avatar"
        onClick={() => {
          handleVisitProfile(data);
        }}
      />
      <span className="data-name">{toUser.userName}</span>
      {currentState === "friends" ? (
        <span className="message" onClick={handleCreateChat}>
          message
        </span>
      ) : (
        <span>
          <span onClick={() => handleAcceptReqest(data._id)}>
            <i className="fa-solid fa-check"></i>
          </span>
          <span onClick={() => handleRejectReqest(data._id)}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        </span>
      )}
    </div>
  );
};

export default ListComponent;
