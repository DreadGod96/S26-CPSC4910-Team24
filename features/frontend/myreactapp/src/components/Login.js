import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("driver");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await fetch(
        process.env.REACT_APP_LOGIN_URL || "http://localhost:3003/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role }),
        }
      );

      if (response.ok) {
        const userData = await response.json();
        login(userData);
        setSuccess("Login successful! Redirecting...");
        const destination = location.state?.from?.pathname || "/dashboard";
        setTimeout(() => navigate(destination, { replace: true }), 1000);
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("Server connection failed.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">
            Email
            <input
              className="login-input"
              type="text"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
            />
          </label>

          <label className="login-label">
            Password
            <input
              className="login-input"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
            />
          </label>

          <div className="login-role">
            <label className="login-label">Login as:</label>
            <div className="role-options">
              <label>
                <input type="radio" value="driver" checked={role === "driver"} onChange={(e) => setRole(e.target.value)} />
                Driver
              </label>
              <label>
                <input type="radio" value="sponsor" checked={role === "sponsor"} onChange={(e) => setRole(e.target.value)} />
                Sponsor
              </label>
              <label>
                <input type="radio" value="admin" checked={role === "admin"} onChange={(e) => setRole(e.target.value)} />
                Admin
              </label>
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}
          {success && <p className="login-success">{success}</p>}

          <button className="login-button" type="submit">
            Sign in
          </button>

          <p className="login-create-account">
            Don't have an account?{" "}
            <a className="login-create-link" href="/create-account">
              Create one here!
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}