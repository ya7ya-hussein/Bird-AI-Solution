import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Upload.css";

const Upload = () => {
  const navigate = useNavigate();
  const [hangarName, setHangarName] = useState("");
  const [hangarSize, setHangarSize] = useState("");
  const [operationType, setOperationType] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const [error, setError] = useState("");
  
  // Real-time streaming states
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(null);
  const [streamingStats, setStreamingStats] = useState({
    frameNumber: 0,
    detections: 0,
    progress: 0,
    totalSpecies: 0
  });
  const [sessionId, setSessionId] = useState(null);
  const [showRealTimeView, setShowRealTimeView] = useState(false);
  
  const canvasRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    if (sessionStorage.getItem("isLoggedIn") !== "true") {
      navigate("/login");
    }
    
    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [navigate]);

  const handleSignOut = () => {
    sessionStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const validateForm = () => {
    if (!hangarName || hangarName.trim() === "") {
      setError("Please enter a hangar name");
      return false;
    }
    if (!hangarSize || hangarSize.trim() === "") {
      setError("Please enter a hangar size");
      return false;
    }
    if (!operationType || operationType.trim() === "") {
      setError("Please enter a type of operation");
      return false;
    }
    if (!videoFile) {
      setError("Please upload a video file");
      return false;
    }
    return true;
  };

  const startVideoStreaming = (sessionId) => {
    setIsStreaming(true);
    setShowRealTimeView(true);
    setProcessingMessage("Processing video with real-time detection...");
    
    // Start polling for frame data
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get_frame/${sessionId}`);
        const data = response.data;
        
        if (data.completed) {
          // Processing completed
          setIsStreaming(false);
          setProcessingMessage("Processing completed! Redirecting to results...");
          clearInterval(pollingIntervalRef.current);
          
          // Get final results and navigate
          setTimeout(async () => {
            try {
              const resultsResponse = await axios.get(`http://localhost:5000/get_results/${sessionId}`);
              navigate("/results", {
                state: {
                  data: {
                    totalBirds: resultsResponse.data.totalBirds,
                    birdTypes: resultsResponse.data.birdTypes,
                    noBirdsDetected: resultsResponse.data.noBirdsDetected,
                    hangarName,
                    hangarSize,
                    operationType,
                  },
                },
              });
            } catch (error) {
              console.error("Error getting final results:", error);
              setError("Error getting final results. Please try again.");
            }
          }, 2000);
          
        } else if (data.frame_base64) {
          // Update current frame and stats
          setCurrentFrame(data.frame_base64);
          setStreamingStats({
            frameNumber: data.frame_number,
            detections: data.detections,
            progress: data.progress,
            totalSpecies: data.total_species || 0
          });
          setUploadProgress(data.progress);
          
          // Draw frame on canvas
          if (canvasRef.current && data.frame_base64) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
              // Set canvas size to match image
              canvas.width = img.width;
              canvas.height = img.height;
              
              // Draw the frame
              ctx.drawImage(img, 0, 0);
            };
            
            img.src = `data:image/jpeg;base64,${data.frame_base64}`;
          }
        } else {
          // Update stats even if no new frame
          setStreamingStats({
            frameNumber: data.frame_number,
            detections: data.detections,
            progress: data.progress,
            totalSpecies: data.total_species || 0
          });
          setUploadProgress(data.progress);
        }
      } catch (error) {
        console.error("Error polling frame data:", error);
        // Don't stop polling on individual errors, just log them
      }
    }, 500); // Poll every 500ms
  };

  const stopProcessing = async () => {
    if (sessionId) {
      try {
        await axios.post(`http://localhost:5000/stop_processing/${sessionId}`);
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        setIsStreaming(false);
        setShowRealTimeView(false);
        setProcessingMessage("");
        setUploadProgress(0);
      } catch (error) {
        console.error("Error stopping processing:", error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("file", videoFile);

    setIsUploading(true);
    setUploadProgress(0);
    setProcessingMessage("Uploading video...");

    try {
      // Upload video and start processing
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
            
            if (percentCompleted === 100) {
              setProcessingMessage("Upload complete! Starting real-time detection...");
            }
          },
        }
      );

      if (response.data.streaming && response.data.session_id) {
        setSessionId(response.data.session_id);
        setIsUploading(false);
        
        // Start real-time streaming with a small delay
        setTimeout(() => {
          startVideoStreaming(response.data.session_id);
        }, 1000);
      } else {
        // Fallback to old method if streaming not available
        navigate("/results", {
          state: {
            data: {
              totalBirds: response.data.totalBirds,
              birdTypes: response.data.birdTypes || [],
              noBirdsDetected: response.data.noBirdsDetected,
              hangarName,
              hangarSize,
              operationType,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload or process video. Please try again.");
      setIsUploading(false);
      setIsStreaming(false);
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container content">
        <h2>
          <i className="fas fa-cloud-upload-alt"></i> Upload a Video
        </h2>
        {error && <div className="error-message">{error}</div>}
        
        {!showRealTimeView ? (
          // Upload Form
          <form className="upload-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Hangar Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter hangar name"
                value={hangarName}
                onChange={(e) => setHangarName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="size">Hangar Size</label>
              <input
                id="size"
                type="text"
                placeholder="Enter hangar size (e.g., 500 sq ft)"
                value={hangarSize}
                onChange={(e) => setHangarSize(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="operation">Type of Operation</label>
              <select
                id="operation"
                value={operationType}
                onChange={(e) => setOperationType(e.target.value)}
              >
                <option value="">Select operation type</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Storage">Storage</option>
                <option value="Assembly">Assembly</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="video-upload">Upload Video</label>
              <div className="file-upload-container">
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="file-input"
                />
                <label htmlFor="video-upload" className="file-upload-label">
                  <i className="fas fa-film"></i> Choose Video
                </label>
                <span className="file-name">
                  {videoFile ? videoFile.name : "No file chosen"}
                </span>
              </div>
            </div>

            {videoPreview && (
              <div className="video-preview">
                <video src={videoPreview} controls width="100%" height="200" />
              </div>
            )}

            {isUploading && (
              <>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
                <div className="processing-message" style={{ marginTop: '10px', textAlign: 'center', color: '#aaa' }}>
                  {processingMessage}
                </div>
              </>
            )}

            <button
              type="submit"
              className="upload-button"
              disabled={isUploading || isStreaming}
            >
              {isUploading ? "Uploading..." : "🚀 Analyze Video"}
            </button>
          </form>
        ) : (
          // Real-time Processing View
          <div className="realtime-processing">
            <div className="realtime-header">
              <h3> Real-time Bird Detection</h3>
              <button 
                onClick={stopProcessing}
                className="stop-button"
                style={{
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-stop"></i> Stop Processing
              </button>
            </div>
            
            <div className="streaming-stats" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px',
              margin: '20px 0',
              padding: '15px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}>
              <div className="stat">
                <strong>Frame:</strong> {streamingStats.frameNumber.toLocaleString()}
              </div>
              <div className="stat">
                <strong>Progress:</strong> {streamingStats.progress.toFixed(1)}%
              </div>
              <div className="stat">
                <strong>Current Birds:</strong> {streamingStats.detections}
              </div>
              <div className="stat">
                <strong>Total Species:</strong> {streamingStats.totalSpecies}
              </div>
            </div>
            
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <span className="progress-text">{uploadProgress.toFixed(1)}%</span>
            </div>
            
            <div className="video-stream-container" style={{
              marginTop: '20px',
              textAlign: 'center',
              border: '2px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              background: '#000',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {currentFrame ? (
                <canvas 
                  ref={canvasRef}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '600px',
                    border: '1px solid #555',
                    borderRadius: '4px'
                  }}
                />
              ) : (
                <div style={{ color: '#aaa', padding: '50px', textAlign: 'center' }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                  <p>Waiting for video stream...</p>
                  <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                    Processing ...
                  </p>
                </div>
              )}
            </div>
            
            <div className="processing-message" style={{ 
              marginTop: '15px', 
              textAlign: 'center', 
              color: '#aaa',
              fontSize: '14px'
            }}>
              {processingMessage}
            </div>
            
            <div className="turbo-info" style={{
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(0,255,0,0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(0,255,0,0.3)'
            }}>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;