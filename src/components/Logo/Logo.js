import React from "react";
import { Link } from "react-router-dom"; // Import Link
import lg from "./pic08.png"; // Adjust the path to your logo image as necessary

const Logo = () => {
  return (
    <div className="flex items-center ma4 mt0 content">
      <Link to="/" className="flex items-center">
        {" "}
        <img
          className="mr2"
          style={{ height: "50px", width: "auto" }}
          alt="logo"
          src={lg}
        />
        <span className="white ma0">Birds ai solution</span>{" "}
      </Link>
    </div>
  );
};

export default Logo;
