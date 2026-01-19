import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform the signup logic
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name, // Make sure these fields match what your Flask app expects
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // If signup is successful, navigate to the login page or wherever you'd like
        navigate("/login");
      } else {
        // If signup failed, handle it here (show error message, etc.)
        console.error("Signup failed:", data.message);
      }
    } catch (error) {
      console.error("There was an error during signup:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container content">
        <h2>Create New Account</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">
            Sign Up
          </button>
          <div className="login-footer">
            Already Registered? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
