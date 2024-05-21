import React from "react";
import { Routes, Route } from "react-router-dom";

//Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import Predictions from "./pages/Predictions";
import Leaderboard from "./pages/Leaderboard";
import NotFoundPage from "./pages/NotFound";
import GroupDetails from "./pages/GroupDetails";

//Components
import Navbar from "./components/Navbar";

//CSS
import "./App.css";

function App() {
  return (
    <div id="root">
      <Navbar />
      <div className="container">
        <div className="content">
          <Routes>
            <Route path="/user/:userId" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/group/:group" element={<GroupDetails />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
