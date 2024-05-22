import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import Predictions from "./pages/Predictions";
import Leaderboard from "./pages/Leaderboard";
import GroupDetails from "./pages/GroupDetails";
import RoundOf16Page from "./pages/RoundOf16Page";
import Landing from "./pages/Landing";
import NotFoundPage from "./pages/NotFound";
//Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
//CSS
import "./App.css";

function App() {
  return (
    <div id="root">
      <Navbar />
      <div className="container">
        <div className="content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/user/:userId" element={<Home />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/group/:group" element={<GroupDetails />} />
              <Route path="/round-of-16" element={<RoundOf16Page />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
