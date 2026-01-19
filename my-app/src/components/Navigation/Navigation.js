import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  const handleSignOut = () => {
    // Clear session
    sessionStorage.removeItem("isLoggedIn");
    // Navigate to home
    navigate("/");
  };

  return (
    <nav className="navigation-container content">
      {!isLoggedIn ? (
        <>
          {(location.pathname === "/" ||
            location.pathname === "/contact-us") && (
            <Link to="/login" className="nav-link">
              <i className="fas fa-sign-in-alt"></i> Log In
            </Link>
          )}
        </>
      ) : (
        <>
          <Link to="/upload" className="nav-link">
            <i className="fas fa-cloud-upload-alt"></i> Upload
          </Link>
          <button onClick={handleSignOut} className="nav-link sign-out-btn">
            <i className="fas fa-sign-out-alt"></i> Sign Out
          </button>
        </>
      )}
    </nav>
  );
};

export default Navigation;
