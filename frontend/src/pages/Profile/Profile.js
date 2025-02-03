import React, { useEffect, useState } from "react";
import "./Profile.css"; // Import the CSS file
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const Profile = () => {
  const [isCurrentUser, setIsCurrentUSer] = useState(false);
  const [user, setUser] = useState({});
  const { userId } = useParams();
  const currentLoginUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (currentLoginUser._id.toString() === userId.toString()) {
      setIsCurrentUSer(true);
    }
    if (!isCurrentUser) {
      axios
        .get(`http://localhost:4000/api/user/getUser/${userId}`)
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      setUser(currentLoginUser);
    }
    console.log(user);
  }, [userId, isCurrentUser, currentLoginUser]);

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          {/* Profile Info Container (Image and Name) */}
          <div className="profile-info-container">
            <div className="profile-image-container">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                alt="Profile"
                className="profile-image"
              />
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user.firstName}</h1>
              <p className="profile-location">{user.education}</p>
            </div>
          </div>

          {/* Buttons Below Profile */}
          <div className="profile-button-container">
            {isCurrentUser === true ? (
              <>
                {" "}
                <button className="profile-button edit-profile">
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <button className="profile-button message">Message</button>
                <button className="profile-button send-request">
                  Send Request
                </button>
              </>
            )}
          </div>
        </div>

        {/* Profile Stats */}
        <div className="profile-stats">
          <div className="stats">
            <p className="stats-value">253</p>
            <p className="stats-label">Photos</p>
          </div>
          <div className="stats">
            <p className="stats-value">1026</p>
            <p className="stats-label">Followers</p>
          </div>
          <div className="stats">
            <p className="stats-value">478</p>
            <p className="stats-label">Following</p>
          </div>
        </div>

        {/* About Section */}
        <div className="profile-about">
          <h5>About</h5>
          <div className="about-details">
            <p className="about-item">Web Developer</p>
            <p className="about-item">Lives in New York</p>
            <p className="about-item">Photographer</p>
          </div>
        </div>

        {/* Recent Photos */}
        <div className="recent-photos">
          <div className="photos-header">
            <h5>Recent Photos</h5>
            <a href="#!" className="show-all-link">
              Show all
            </a>
          </div>
          <div className="photo-gallery">
            <div className="photo-item">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp"
                alt="Photo 1"
                className="photo-image"
              />
            </div>
            <div className="photo-item">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp"
                alt="Photo 2"
                className="photo-image"
              />
            </div>
            <div className="photo-item">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp"
                alt="Photo 3"
                className="photo-image"
              />
            </div>
            <div className="photo-item">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp"
                alt="Photo 4"
                className="photo-image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
