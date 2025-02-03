import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToken, addUser } from "../../utils/AuthSlice";

const LoginPopup = ({ setIsLogin }) => {
  const [currState, setCurrState] = useState("Sign up");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currState === "Sign up") {
        const res = await axios.post("http://localhost:4000/api/auth/signup", {
          firstName,
          lastName,
          userName,
          emailId,
          password,
        });
        if (res.data.success) {
          alert("Registered successfully");
          setCurrState("login");
        } else {
          alert(res.data.message || "Error in user registration!!!");
        }
      } else {
        const res = await axios.post(
          "http://localhost:4000/api/auth/login",
          { emailId, password },
          { withCredentials: true }
        );
        if (res.data.success) {
          alert("User logged in successfully");
          const token = res.data.token;
          const user = res.data.user; // Assuming user info is also returned in the response
          localStorage.setItem("token", token);
          dispatch(addToken(token));
          dispatch(addUser(user)); // Dispatch user details
          navigate("/edit");
        } else {
          alert(res.data.message || "Failed to log in user!!!");
        }
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
      alert(errorMessage);
    }
  };

  return (
    <div className="login-popUp">
      <form className="login-popUp-container" onSubmit={handleSubmit}>
        <div className="login-popUp-title">
          <h2>{currState}</h2>
          <span onClick={() => setIsLogin(false)}>✕</span>
        </div>
        <div className="login-popUp-inputs">
          {currState === "login" ? null : (
            <>
              <input
                type="text"
                placeholder="Your First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Your Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter a user name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </>
          )}
          <input
            type="email"
            placeholder="Your email"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">
          {currState === "Sign up" ? "Create Account" : "Log In"}
        </button>
        <div className="login-popUp-terms">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms and conditions</p>
        </div>
        {currState === "login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("login")}>Log in here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
