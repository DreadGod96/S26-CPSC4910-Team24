import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";


export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("driver");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();



  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
        setSuccess("");
        setError("Please fill in all fields.");
        return;
    }

    if (!email.includes("@")) {
        setSuccess("");
        setError("Please enter a valid email address.");
        return;
    }

    if (password.length < 6) {
        setSuccess("");
        setError("Password must be at least 6 characters.");
        return;
    }

    // Frontend-only for now:
    console.log({ email, password, role });
    setSuccess("Login successful! Redirecting...");

    setIsLoggedIn(true);

    setTimeout(() => {

    if (role === "driver") {
      navigate("/dashboard");
    } else if (role === "sponsor") {
      navigate("/orgboard"); // change later when sponsor dashboard exists
    } else if (role === "admin") {
      navigate("/adboard"); // change later when admin dashboard exists
    }

  }, 1000);

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
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setSuccess("");
                }}
              //required
            />
          </label>

          <label className="login-label">
            Password
            <input
              className="login-input"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
                setSuccess("");
                }}
              //required
            />
          </label>

          <div className="login-role">
            <label className="login-label">Login as:</label>

            <div className="role-options">

              <label>
                <input
                  type="radio"
                  value="driver"
                  checked={role === "driver"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Driver
              </label>

              <label>
                <input
                  type="radio"
                  value="sponsor"
                  checked={role === "sponsor"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Sponsor
              </label>

              <label>
                <input
                  type="radio"
                  value="admin"
                  checked={role === "admin"}
                  onChange={(e) => setRole(e.target.value)}
                />
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
            <Link to="/create-account" className="login-create-link">
              Create one here!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
