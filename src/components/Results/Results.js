import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Results.css";
import "../Upload/Upload.css";

const Results = () => {
  const location = useLocation();
  const { totalBirds, birdTypes, hangarName, hangarSize, operationType } =
    location.state.data;
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Perform sign out logic here, like clearing the auth token or user state
    // ...

    // Navigate to the Hero/Main page
    navigate("/");
  };
  const handleBack = () => {
    navigate("/upload"); // Navigate back to Upload.js
  };

  function getBirdRecommendations(birdType) {
    const lowercaseBirdType = birdType.toLowerCase();

    if (lowercaseBirdType.includes("pigeon")) {
      // Pigeon recommendations
      return `
            Types of Bird: ${birdType}
            Highly Recommended: Netting and fencing, Aircraft Hazing, Bird spikes
            Medium Recommendation: Distress and Alarm calls, Reflectors
            Limited Recommendation: Laser, Rc Model Drone
            Not Recommended: Ultrasound, Chemical
            Distress and Alarm calls: 1
        `;
    } else if (lowercaseBirdType.includes("dove")) {
      // Dove recommendations
      return `
            Types of Bird: ${birdType}
            Highly Recommended: Netting and fencing, Aircraft Hazing, Bird spikes
            Medium Recommendation: Distress and Alarm calls, Reflectors
            Limited Recommendation: Laser, Rc Model Drone
            Not Recommended: Ultrasound, Chemical
            Distress and Alarm calls: 1
        `;
    } else if (lowercaseBirdType.includes("crow")) {
      // Crow recommendations
      return `
            Types of Bird: ${birdType}
            Highly Recommended: Netting and fencing, Aircraft Hazing
            Medium Recommendation: Distress and Alarm calls, Reflectors (Limited references)
            Limited Recommendation: Laser
            Not Recommended: Ultrasound, Chemical, Rc Model Drone
            Distress and Alarm calls: 2
        `;
    } else if (lowercaseBirdType.includes("blackbird")) {
      // Blackbird recommendations
      return `
            Types of Bird: ${birdType}
            Highly Recommended: Netting and fencing, Aircraft Hazing
            Medium Recommendation: Distress and Alarm calls, Reflectors
            Limited Recommendation: Laser
            Not Recommended: Ultrasound, Chemical, Rc Model Drone
            Distress and Alarm calls: 3
        `;
    } else if (lowercaseBirdType.includes("cowbird")) {
      // Cowbird recommendations
      return `
            Types of Bird: ${birdType}
            Highly Recommended: Netting and fencing, Aircraft Hazing
            Medium Recommendation: Distress and Alarm calls, Reflectors
            Limited Recommendation: Laser
            Not Recommended: Ultrasound, Chemical, Rc Model Drone
            Distress and Alarm calls: 3
        `;
    } else if (lowercaseBirdType.includes("european starling")) {
      // European Starling recommendations
      return `
            Types of Bird: ${birdType}
            Highly Recommended: Netting and fencing, Aircraft Hazing
            Medium Recommendation: Distress and Alarm calls, Reflectors
            Limited Recommendation: Laser
            Not Recommended: Ultrasound, Chemical, Rc Model Drone
            Distress and Alarm calls: 3
        `;
    } else if (lowercaseBirdType.includes("sparrow")) {
      // Sparrow recommendations
      return `
            Types of Bird: ${birdType}
            Highly Recommended: Netting and fencing, Aircraft Hazing
            Medium Recommendation: Distress and Alarm calls, Reflectors
            Limited Recommendation: Laser
            Not Recommended: Ultrasound, Chemical, Rc Model Drone
            Distress and Alarm calls: 3
        `;
    } else if (lowercaseBirdType.includes("cormorant")) {
      // Cormorant recommendations
      return `
            Types of Bird: ${birdType}
            Highly Recommended: Netting and fencing, Aircraft Hazing
            Medium Recommendation: Distress and Alarm calls, Reflectors
            Limited Recommendation: Laser
            Not Recommended: Ultrasound, Chemical, Rc Model Drone
            Distress and Alarm calls: 3
        `;
    } else if (lowercaseBirdType.includes("waterfowl")) {
      // Waterfowl recommendations
      return `
            Types of Bird: ${birdType}
            Highly Recommended: Netting and fencing, Aircraft Hazing
            Medium Recommendation: Distress and Alarm calls, Reflectors
            Limited Recommendation: Laser
            Not Recommended: Ultrasound, Chemical, Rc Model Drone
            Distress and Alarm calls: 3
        `;
    } else if (lowercaseBirdType.includes("mallard")) {
      // Mallard recommendations
      return `
            Types of Bird: ${birdType}
            Highly Recommended: Netting and fencing, Aircraft Hazing
            Medium Recommendation: Distress and Alarm calls, Reflectors
            Limited Recommendation: Laser
            Not Recommended: Ultrasound, Chemical, Rc Model Drone
            Distress and Alarm calls: 3
        `;
    } else if (lowercaseBirdType.includes("owl")) {
      // Owl recommendations
      return `
            Types of Bird: ${birdType}
            Highly Recommended: Netting and fencing, Aircraft Hazing
            Medium Recommendation: Distress and Alarm calls, Reflectors
            Limited Recommendation: Laser
            Not Recommended: Ultrasound, Chemical, Rc Model Drone
            Distress and Alarm calls: 3
        `;
    } else if (lowercaseBirdType.includes("geese")) {
      // Geese recommendations
      return `
            Types of Bird: ${birdType}
            Highly Recommended: Netting and fencing, Aircraft Hazing
            Medium Recommendation: Distress and Alarm calls, Reflectors
            Limited Recommendation: Laser
            Not Recommended: Ultrasound, Chemical, Rc Model Drone
            Distress and Alarm calls: 3
        `;
    } else if (lowercaseBirdType.includes("gull")) {
      // Gull recommendations
      return `
            Types of Bird: ${birdType}
            Highly Recommended: Netting and fencing, Aircraft Hazing
            Medium Recommendation: Reflectors
            Limited Recommendation: Laser, Distress and Alarm calls
            Not Recommended: Ultrasound, Chemical, Rc Model Drone, Magnet Devices
            Distress and Alarm calls: Not Recommended
        `;
    } else {
      return `${birdType} not recognized.`;
    }
  }

  // Example usage
  console.log(getBirdRecommendations("Pigeons"));

  return (
    <div className="upload-page">
      <div className="top-right-buttons content">
        <button onClick={handleBack} className="button content pointer">
          Back
        </button>
        <button onClick={handleSignOut} className="button content pointer">
          Sign Out
        </button>
        {/* Use a button instead of Link */}
      </div>
      <div className="upload-container content">
        <h2>Results</h2>
        <div className="results-display">
          <p>Total Number of Birds: {totalBirds}</p>
          <div>
            <p>Bird Types:</p>
            <ul>
              {birdTypes.map((type) => (
                <li key={type}>{type}</li>
              ))}
            </ul>
          </div>
          <p>Hangar Name: {hangarName}</p>
          <p>Hangar Size: {hangarSize}</p>
          <p>Type of Operation: {operationType}</p>
        </div>
      </div>
      <div className="upload-container content">
        <h2>Recommendations</h2>
        {birdTypes.map((type) => (
          <p key={type}>{getBirdRecommendations(type)}</p>
        ))}
      </div>
      <div className="footer">
        <p>
          <i className="fas fa-map-marker-alt"></i> Jalan Lapangan Terbang
          Subang, U 3, 47200 Shah Alam, Selangor
        </p>
        <p>
          <i className="fas fa-phone"></i> +6011-39303914
        </p>
        <p>
          <i className="fas fa-envelope"></i> yaser.ameen@s.unikl.edu.my
        </p>
      </div>
    </div>
  );
};

export default Results;
// ##
