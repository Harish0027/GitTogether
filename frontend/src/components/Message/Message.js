// Message.js
import React, { useEffect, useState } from "react";
import "./Message.css";
import { useSelector } from "react-redux";

const Message = ({ sender, message, isSent }) => {
  const [newSender, setNewSender] = useState("");
  const currentLoginUser = useSelector((res) => res.auth.user);

  useEffect(() => {
    if (currentLoginUser._id.toString() === sender._id.toString()) {
      setNewSender("You");
    } else {
      setNewSender(sender.userName);
    }
  }, [sender]);
  
  return (
    <div className={`message-wrapper ${isSent ? "right" : "left"}`}>
      <div className={`message-container ${isSent ? "sent" : "received"}`}>
        <span className="message-sender">{newSender || "Unknown"} :</span>
        <span className="message-content">{message || "No Content"}</span>
      </div>
    </div>
  );
};

export default Message;
