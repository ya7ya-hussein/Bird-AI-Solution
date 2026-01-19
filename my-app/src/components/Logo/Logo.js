import React from "react";
import { Link } from "react-router-dom";
import lg from "./pic08.png"; // Your bird icon
import "./Logo.css"; // We'll create this file

const Logo = () => {
  return (
    <div className="logo-container content">
      <Link to="/" className="logo-link">
        <img className="logo-image" alt="logo" src={lg} />
        <span className="logo-text">Birds ai solution</span>
      </Link>
    </div>
  );
};

export default Logo;
