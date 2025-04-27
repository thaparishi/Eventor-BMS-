import React from "react";
import { useNavigate } from "react-router-dom";
import "./Pagenf.css";

const Pagenf = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="mainn">
      <h1 className="pnf">Page Not Found</h1>
      <button onClick={goToHome} className="home-button">
        Go Back to Home
      </button>
    </div>
  );
};

export default Pagenf;