import React from "react";
import "./Dbanquet.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";

const DBanquet = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="container">
      <div className="login-box">
        <h1>Please log in to view this page</h1>
        <button onClick={handleLogin}>Log In</button>
      </div>
    </div>
  );
};

export default DBanquet;