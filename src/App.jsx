import React from "react";
import { Routes, Route } from "react-router-dom";

//Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Predictions from "./pages/Predictions";
import Leaderboard from "./pages/Leaderboard";
import UserList from "./pages/UserList";
import NotFoundPage from "./pages/NotFound";
import GroupDetails from "./pages/GroupDetails";

//Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

//CSS
import "./App.css";

function App() {
  return (
    <div id="root">
      <Navbar />
      <div className="container">
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/group/:group" element={<GroupDetails />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/userList" element={<UserList />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
