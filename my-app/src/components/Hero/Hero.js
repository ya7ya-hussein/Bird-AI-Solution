import React from "react";
import "./Hero.css";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="content-section content">
      <h1>Efficiently Optimize Hangar Operations with Birds AI</h1>
      <p>
        Managing birds in your hangar can be a complex and challenging task.
        That's where the AI birds system comes in - the smart solution that
        monitors your hangar, gives you real-time insights into bird behaviour,
        and provides recommendations based on a variety of applications and
        data. With this powerful system at your disposal, you'll be able to make
        informed decisions and take decisive action to keep your hangar safe and
        secure.
      </p>
      <Link to="/contact-us">
        <button className="cta-button">Contact Us</button>
      </Link>
    </div>
  );
};

export default Hero;
