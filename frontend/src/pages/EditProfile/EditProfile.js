import React, { useEffect, useState } from "react";
import "./EditProfile.css"; // Ensure the CSS file is linked
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../utils/AuthSlice";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [avatar, setAvatar] = useState(""); // Store the selected avatar preview URL
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [state, setState] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [education, setEducation] = useState("");

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/auth/getAuth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(addUser(res.data.user));
        setCurrentUser(res.data.user);
      })
      .catch((error) => {
        alert(error.message);
        navigate("/");
      });
  }, [token, navigate, dispatch]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // Check if the file is larger than 5MB
        alert("File size is too large. Please select a file smaller than 5MB.");
        return;
      }
      const fileUrl = URL.createObjectURL(file); // Create a preview URL for the selected file
      setAvatar(fileUrl); // Update the avatar preview URL
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") setCountry(value);
    if (name === "state") setState(value);
    if (name === "mobileNo") setMobileNo(value);
    if (name === "education") setEducation(value);
    if (name === "gender") setGender(value);
    if (name === "birthDate") setBirthDate(value);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    const avatarFileInput = document.getElementById("file-upload");
    
    // Only append the avatar if a file is selected
    if (avatarFileInput.files[0]) {
      formData.append("avatar", avatarFileInput.files[0]);
    }

    formData.append("country", country);
    formData.append("state", state);
    formData.append("mobileNo", mobileNo);
    formData.append("education", education);
    formData.append("gender", gender);
    formData.append("birthDate", birthDate);

    axios
      .put("http://localhost:4000/api/user/completeProfile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          alert("Profile saved!!!");
          navigate("/feed");
        }
      })
      .catch((error) => {
        alert(error.response?.data?.message || error.message);
      });
  };

  const handleSkip = () => {
    navigate("/feed");
  };

  return (
    <div className="profile-container">
      <div className="container">
        <div className="row">
          {/* Profile Picture Section */}
          <div className="col-lg-4 col-md-6 col-sm-12 profile-section">
            <div className="profile-image-container">
              <input
                type="file"
                id="file-upload"
                name="avatar"
                className="custom-file-input"
                onChange={handleAvatarChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              <img
                className="profile-image"
                width="150px"
                src={
                  currentUser.avatar
                    ? `http://localhost:4000/public/${currentUser.avatar}`
                    : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                }
                alt="Profile"
                onClick={() => document.getElementById("file-upload").click()} // Trigger file input on image click
              />
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{currentUser.userName}</h2>
              <p className="profile-email">{currentUser.emailId}</p>
            </div>
          </div>

          {/* Profile Settings Form */}
          <div className="col-lg-8 col-md-6 col-sm-12">
            <div className="form-section">
              <h3 className="section-title">Profile Settings</h3>

              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="country" className="form-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    value={country}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Country"
                    aria-label="Country"
                  />
                </div>

                <div className="col-md-12">
                  <label htmlFor="state" className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    value={state}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="State"
                    aria-label="State"
                  />
                </div>

                <div className="col-md-12">
                  <label htmlFor="mobileNo" className="form-label">Mobile Number</label>
                  <input
                    type="text"
                    name="mobileNo"
                    id="mobileNo"
                    value={mobileNo}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Mobile Number"
                    aria-label="Mobile Number"
                  />
                </div>

                <div className="col-md-12 d-flex justify-content-between align-items-start gap-3">
                  <div className="flex-fill">
                    <label htmlFor="gender" className="form-label">Gender</label>
                    <select
                      name="gender"
                      id="gender"
                      value={gender}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex-fill">
                    <label htmlFor="birthDate" className="form-label">Birth Date</label>
                    <input
                      type="date"
                      name="birthDate"
                      id="birthDate"
                      value={birthDate}
                      onChange={handleChange}
                      className="form-control"
                      aria-label="Birth Date"
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <label htmlFor="education" className="form-label">Education</label>
                  <input
                    type="text"
                    name="education"
                    id="education"
                    value={education}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Education"
                    aria-label="Education"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 text-center">
          <button className="save-btn" onClick={handleSubmit}>
            Save Profile
          </button>
          <button className="skip-btn" onClick={handleSkip}>
            Skip for this time
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
