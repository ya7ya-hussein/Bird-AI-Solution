// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Hero from "./components/Hero/Hero";
import Login from "./components/LoginSignUp/login";
import SignUp from "./components/LoginSignUp/SignUp";
import Upload from "./components/Upload/Upload";
import ContactUs from "./components/ContactUs/ContactUs";
import Results from "./components/Results/Results";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="flex justify-between items-start pa3">
          <Logo />
          <Navigation />
        </header>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/results" element={<Results />} />

          {/* Make sure this route is defined */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
