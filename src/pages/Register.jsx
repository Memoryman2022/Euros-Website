import React, { useState, useContext } from "react"; // Import useContext
import { AuthContext } from "../authContext/auth.context"; // Import AuthContext
import "../Css/Register.css";

function Register() {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const { registerUser, authError } = useContext(AuthContext); // Use AuthContext

  const handleRegister = async (e) => {
    e.preventDefault();
    await registerUser(userName, email, password, profileImage);
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={userName}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Profile Image:</label>
          <input type="file" onChange={handleImageChange} />
        </div>
        {authError && <p className="error">{authError}</p>}{" "}
        {/* Display auth error */}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
