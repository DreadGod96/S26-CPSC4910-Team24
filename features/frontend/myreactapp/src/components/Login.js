import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();



  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
        setError("Please fill in all fields.");
        return;
    }

    if (!email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
    }

    if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
    }

    // Frontend-only for now:
    console.log({ email, password });
    setSuccess("Login successful! Redirecting...");

    setTimeout(() => {
    navigate("/dashboard");
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
                }}
              //required
            />
          </label>

          {error && <p className="login-error">{error}</p>}
          {success && <p className="login-success">{success}</p>}

          <button className="login-button" type="submit">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
