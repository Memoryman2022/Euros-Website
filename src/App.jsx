import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

//Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Predictions from "./pages/Predictions";
import Leaderboard from "./pages/Leaderboard";
import { NotFoundPage } from "./pages/NotFound";

//Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
//CSS
import "./App.css";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
