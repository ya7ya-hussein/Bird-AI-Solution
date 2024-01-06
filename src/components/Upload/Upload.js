import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Upload.css";

const Upload = () => {
  const navigate = useNavigate();
  const [hangarName, setHangarName] = useState("");
  const [hangarSize, setHangarSize] = useState("");
  const [operationType, setOperationType] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [results, setResults] = useState(null);

  const handleSignOut = () => {
    // Perform sign out logic here, like clearing the auth token or user state
    // ...

    // Navigate to the Hero/Main page
    navigate("/");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic Validation
    if (!hangarName || hangarName.trim() === "") {
      alert("Please enter a hangar name.");
      return;
    }
    if (!hangarSize || hangarSize.trim() === "") {
      alert("Please enter a hangar size.");
      return;
    }
    if (!operationType || operationType.trim() === "") {
      alert("Please enter a type of operation.");
      return;
    }
    if (!videoFile) {
      alert("Please upload a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", videoFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResults(response.data); // Update the results state with the response data
      navigate("/results", {
        state: {
          data: {
            totalBirds: response.data.totalBirds, // Assuming your backend returns this
            birdTypes: response.data.birdTypes, // Assuming your backend returns this
            hangarName, // Data from the form
            hangarSize, // Data from the form
            operationType, // Data from the form
          },
        },
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        alert("Please upload a valid video file.");
        return;
      }
      // Assuming you want to keep the file object in state
      setVideoFile(file);
    }
  };

  return (
    <div className="upload-page">
      <div className="top-right-buttons content">
        <button onClick={handleSignOut} className="button content pointer">
          Sign Out
        </button>
        {/* Use a button instead of Link */}
      </div>
      <div className="upload-container content">
        <h2>Upload a Video</h2>
        <form className="upload-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Hangar Name</label>
          <input
            id="name"
            type="text"
            placeholder="Hangar Name"
            value={hangarName}
            onChange={(e) => setHangarName(e.target.value)}
          />

          <label htmlFor="size">Hanger Size</label>
          <input
            id="size"
            type="text"
            placeholder="Hangar Size"
            value={hangarSize}
            onChange={(e) => setHangarSize(e.target.value)}
          />

          <label htmlFor="operation">Type of operation</label>
          <input
            id="operation"
            type="text"
            placeholder="Type of operation"
            value={operationType}
            onChange={(e) => setOperationType(e.target.value)}
          />

          <label htmlFor="video-upload">Upload Video</label>
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
          />

          <button type="submit" className="upload-button">
            Enter
          </button>
        </form>
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

export default Upload;
