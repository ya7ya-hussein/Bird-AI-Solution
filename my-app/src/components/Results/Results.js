import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Results.css";

const Results = () => {
  const location = useLocation();
  const { totalBirds, birdTypes, noBirdsDetected, hangarName, hangarSize, operationType } =
    location.state?.data || {};
  const navigate = useNavigate();

  const handleSignOut = () => {
    sessionStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const handleBack = () => {
    navigate("/upload");
  };

  // Define the base bird categories with their recommendations
  const birdCategories = {
    sparrow: {
      highlyRecommended: ["Netting and fencing", "Aircraft Hazing"],
      mediumRecommendation: ["Distress and Alarm calls", "Reflectors"],
      limitedRecommendation: ["Laser"],
      notRecommended: ["Ultrasound", "Chemical", "Rc Model Drone"],
      distressCallLevel: 0,
    },
    pigeons: {
      highlyRecommended: [
        "Netting and fencing",
        "Aircraft Hazing",
        "Bird spikes",
      ],
      mediumRecommendation: ["Distress and Alarm calls", "Reflectors"],
      limitedRecommendation: ["Laser", "Rc Model Drone"],
      notRecommended: ["Ultrasound", "Chemical"],
      distressCallLevel: 1,
    },
    doves: {
      highlyRecommended: [
        "Netting and fencing",
        "Aircraft Hazing",
        "Bird spikes",
      ],
      mediumRecommendation: ["Distress and Alarm calls", "Reflectors"],
      limitedRecommendation: ["Laser", "Rc Model Drone"],
      notRecommended: ["Ultrasound", "Chemical"],
      distressCallLevel: 1,
    },
    crows: {
      highlyRecommended: ["Netting and fencing", "Aircraft Hazing"],
      mediumRecommendation: [
        "Distress and Alarm calls",
        "Reflectors (Limited references)",
      ],
      limitedRecommendation: ["Laser"],
      notRecommended: ["Ultrasound", "Chemical", "Rc Model Drone"],
      distressCallLevel: 2,
    },
    blackbirds: {
      highlyRecommended: ["Netting and fencing", "Aircraft Hazing"],
      mediumRecommendation: ["Distress and Alarm calls", "Reflectors"],
      limitedRecommendation: ["Laser"],
      notRecommended: ["Ultrasound", "Chemical", "Rc Model Drone"],
      distressCallLevel: 3,
    },
    cowbirds: {
      highlyRecommended: ["Netting and fencing", "Aircraft Hazing"],
      mediumRecommendation: ["Distress and Alarm calls", "Reflectors"],
      limitedRecommendation: ["Laser"],
      notRecommended: ["Ultrasound", "Chemical", "Rc Model Drone"],
      distressCallLevel: 3,
    },
    starlings: {
      highlyRecommended: ["Netting and fencing", "Aircraft Hazing"],
      mediumRecommendation: ["Distress and Alarm calls", "Reflectors"],
      limitedRecommendation: ["Laser"],
      notRecommended: ["Ultrasound", "Chemical", "Rc Model Drone"],
      distressCallLevel: 3,
    },
    cormorants: {
      highlyRecommended: ["Netting and fencing", "Aircraft Hazing"],
      mediumRecommendation: ["Distress and Alarm calls", "Reflectors"],
      limitedRecommendation: ["Laser"],
      notRecommended: ["Ultrasound", "Chemical", "Rc Model Drone"],
      distressCallLevel: 3,
    },
    waterfowls: {
      highlyRecommended: ["Netting and fencing", "Aircraft Hazing"],
      mediumRecommendation: ["Distress and Alarm calls", "Reflectors"],
      limitedRecommendation: ["Laser"],
      notRecommended: ["Ultrasound", "Chemical", "Rc Model Drone"],
      distressCallLevel: 3,
    },
    mallards: {
      highlyRecommended: ["Netting and fencing", "Aircraft Hazing"],
      mediumRecommendation: ["Distress and Alarm calls", "Reflectors"],
      limitedRecommendation: ["Laser"],
      notRecommended: ["Ultrasound", "Chemical", "Rc Model Drone"],
      distressCallLevel: 3,
    },
    owls: {
      highlyRecommended: ["Netting and fencing", "Aircraft Hazing"],
      mediumRecommendation: ["Distress and Alarm calls", "Reflectors"],
      limitedRecommendation: ["Laser"],
      notRecommended: ["Ultrasound", "Chemical", "Rc Model Drone"],
      distressCallLevel: 3,
    },
    geese: {
      highlyRecommended: ["Netting and fencing", "Aircraft Hazing"],
      mediumRecommendation: ["Distress and Alarm calls", "Reflectors"],
      limitedRecommendation: ["Laser"],
      notRecommended: ["Ultrasound", "Chemical", "Rc Model Drone"],
      distressCallLevel: 3,
    },
    gulls: {
      highlyRecommended: ["Netting and fencing", "Aircraft Hazing"],
      mediumRecommendation: ["Reflectors"],
      limitedRecommendation: ["Laser", "Distress and Alarm calls"],
      notRecommended: [
        "Ultrasound",
        "Chemical",
        "Rc Model Drone",
        "Magnet Devices",
      ],
      distressCallLevel: 0,
    },
  };

  function getBirdRecommendations(birdType) {
    // Convert to lowercase for case-insensitive matching
    const lowercaseBirdType = birdType.toLowerCase();

    // Check if the detected bird contains any of our defined categories
    for (const category in birdCategories) {
      if (lowercaseBirdType.includes(category.toLowerCase())) {
        return {
          type: birdType,
          recognized: true,
          ...birdCategories[category],
        };
      }
    }

    // If no category matches, return a "not recognized" response
    return {
      type: birdType,
      recognized: false,
      notRecognizedMessage: `${birdType} not recognized.`,
    };
  }

  return (
    <div className="results-page">
      <div className="results-header">
        <h1>Analysis Results</h1>
        <div className="action-buttons">
          <button onClick={handleBack} className="back-button">
            <i className="fas fa-arrow-left"></i> Back
          </button>
          <button onClick={handleSignOut} className="sign-out-button">
            <i className="fas fa-sign-out-alt"></i> Sign Out
          </button>
        </div>
      </div>

      <div className="results-container">
        <div className="results-summary-card">
          <h2>Detection Summary</h2>
          <div className="summary-stats">
            <div className="stat-item">
              <i className="fas fa-bird"></i>
              <span className="stat-value">{totalBirds}</span>
              <span className="stat-label">Total Birds</span>
            </div>
            <div className="stat-item">
              <i className="fas fa-layer-group"></i>
              <span className="stat-value">{birdTypes?.length || 0}</span>
              <span className="stat-label">Bird Species</span>
            </div>
          </div>

          <div className="hangar-info">
            <h3>Hangar Information</h3>
            <p>
              <strong>Name:</strong> {hangarName}
            </p>
            <p>
              <strong>Size:</strong> {hangarSize}
            </p>
            <p>
              <strong>Operation:</strong> {operationType}
            </p>
          </div>
        </div>

        <div className="bird-types-card">
          <h2>Detected Bird Species</h2>
          {noBirdsDetected ? (
            <div className="no-birds-message" style={{
              padding: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              marginTop: "15px",
              textAlign: "center"
            }}>
              <i className="fas fa-search" style={{ fontSize: "2rem", marginBottom: "10px" }}></i>
              <p>No birds were detected in the uploaded video.</p>
            </div>
          ) : (
            <div className="bird-types-grid">
              {birdTypes?.map((type) => (
                <div className="bird-type-item" key={type}>
                  <i className="fas fa-feather-alt"></i>
                  <span>{type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!noBirdsDetected && birdTypes?.length > 0 && (
        <div className="recommendations-section">
          <h2>Recommended Control Measures</h2>
          {birdTypes?.map((type) => {
            const recommendations = getBirdRecommendations(type);

            if (!recommendations.recognized) {
              // Display a simple "not recognized" message for unrecognized birds
              return (
                <div className="recommendation-card" key={type}>
                  <h3>{type}</h3>
                  <p className="not-recognized-message">
                    {recommendations.notRecognizedMessage}
                  </p>
                </div>
              );
            }

            // Display the regular recommendation UI for recognized birds
            return (
              <div className="recommendation-card" key={type}>
                <h3>{type}</h3>
                <div className="recommendation-categories">
                  <div className="rec-category">
                    <h4 className="highly-recommended">Highly Recommended</h4>
                    <ul>
                      {recommendations.highlyRecommended.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rec-category">
                    <h4 className="medium-recommended">Medium Recommendation</h4>
                    <ul>
                      {recommendations.mediumRecommendation.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rec-category">
                    <h4 className="limited-recommended">
                      Limited Recommendation
                    </h4>
                    <ul>
                      {recommendations.limitedRecommendation.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rec-category">
                    <h4 className="not-recommended">Not Recommended</h4>
                    <ul>
                      {recommendations.notRecommended.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="distress-call-info">
                  <p>
                    <strong>Distress Call Level:</strong>{" "}
                    {recommendations.distressCallLevel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

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