import React, { useState, useContext } from "react";
import { AuthContext } from "../authContext/auth.context";
import "../Css/Register.css";

function Register() {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { registerUser, authError } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    await registerUser(userName, email, password, profileImage);
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
    setShowModal(false);
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    document.getElementById("profileImageInput").click();
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h4>Register</h4>
        <form onSubmit={handleRegister}>
          <div>
            <label>Username</label>
            <input
              type="text"
              value={userName}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Profile Image</label>
            <input
              type="file"
              id="profileImageInput"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <button onClick={handleImageClick}>Upload</button>
          </div>
          {authError && <p className="error">{authError}</p>}
          <button type="submit">Register</button>
        </form>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Please crop your image to a square for optimal results</h3>
              <button className="modal-btn" onClick={handleModalConfirm}>
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
