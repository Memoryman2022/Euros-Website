import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../authContext/auth.context";
import { useNavigate } from "react-router-dom";
import "../Css/AuthStyles.css"; // Import the unified CSS file

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser, authError, isLoading, isLoggedIn, user } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Call the login function from the context
    await loginUser(email, password);
  };

  useEffect(() => {
    if (isLoggedIn && user && user._id) {
      navigate(`/user/${user._id}`); // Redirect to the user's unique home page
    }
  }, [isLoggedIn, user, navigate]);

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h4>Login</h4>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="auth-btn" type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {authError && <p className="error">{authError}</p>}
      </form>
    </div>
  );
}

export default Login;
