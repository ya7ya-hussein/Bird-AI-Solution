import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation from react-router-dom

const Navigation = () => {
  const location = useLocation(); // Get the current location

  // Check if the pathname is either the root ('/') or '/contact-us'
  const shouldShowLogin =
    location.pathname === "/" || location.pathname === "/contact-us";

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        margin: "0",
        padding: "0",
        fontSize: "24px",
      }}
    >
      {shouldShowLogin && ( // Only show the Log In link on the specified paths
        <Link
          to="/login"
          className="f3 link dim white underline pa3 pointer ma0 login-hover content"
        >
          Log In
        </Link>
      )}
    </nav>
  );
};

export default Navigation;
