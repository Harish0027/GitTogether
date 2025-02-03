import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import UserProfileCard from "../../components/UserProfileCard/UserProfileCard";
import "./Feed.css";
import { useSelector } from "react-redux";
import axios from "axios";

const FeedPage = () => {
  const [myFeeds, setMyFeeds] = useState([]);
  const token = useSelector((res) => res.auth.token);
  const currentLoginUser = useSelector((state) => state.auth.user);

  const fetchUserFeed = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/user/getUserFeed",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMyFeeds(res.data.feed);
      console.log(myFeeds);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchUserFeed();
  }, []);

  return (
    <div className="feed-page">
      <Sidebar style={{ width: "100%" }} user={currentLoginUser} />
      <div className="feed-main">
        {myFeeds.length > 0 ? (
          <UserProfileCard user={myFeeds[0]} onRequestSent={fetchUserFeed} />
        ) : (
          <p>No feeds available</p>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
