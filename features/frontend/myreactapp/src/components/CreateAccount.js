import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";

export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("sponsor");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
    setSuccess("");
    setError("Please fill in all fields.");
    return;
    }

    if (password.length < 6) {
    setSuccess("");
    setError("Password must be at least 6 characters.");
    return;
    }

    if (password !== confirmPassword) {
    setSuccess("");
    setError("Passwords do not match.");
    return;
    }

    try { 
        const response = await fetch("https://tigerpoints-dev.duckdns.org/api/register", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email: email, 
                password: password,
                role: role,
                username: email.split('@')[0],
                first_name: "New",
                last_name: "User",
                phone: "000-000-0000",
                company_ID: 1
                }),
        });

        const data = await response.json();

        if (response.ok) {
            setSuccess("Registration successful! Redirecting...");
            setError("");
            setTimeout(() => navigate("/"), 1200);
        }
        else {
            setError(data.error || "Registration failed.");
            }
    } catch (err) {
        setError("Server connection failed.");
        console.error("Registration error", err);
        }
};

  return (
    <div className="create-account-page">
      <div className="create-account-card">
        <h2 className="create-account-title">Create Account</h2>

        <form onSubmit={handleSubmit} className="create-account-form">

          <label className="create-account-label">
            Email
            <input
              type="email"
              className="create-account-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setSuccess("");
              }}
            />
          </label>

          <label className="create-account-label">
            Password
            <input
              type="password"
              className="create-account-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
                setSuccess("");
              }}
            />
          </label>

          <label className="create-account-label">
            Confirm Password
            <input
              type="password"
              className="create-account-input"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
            />
          </label>

          <div className="create-account-role-group">
            <span className="create-account-role-title">Account Type</span>

            <label className="create-account-radio">
              <input
                type="radio"
                value="driver"
                checked={role === "driver"}
                onChange={(e) => setRole(e.target.value)}
              />
              Driver
            </label>

            <label className="create-account-radio">
              <input
                type="radio"
                value="sponsor"
                checked={role === "sponsor"}
                onChange={(e) => setRole(e.target.value)}
              />
              Sponsor
            </label>
          </div>

          <button type="submit" className="create-account-button">
            Create Account
          </button>
          {error && <p className="create-account-error">{error}</p>}
          {success && <p className="create-account-success">{success}</p>}


        </form>
      </div>
    </div>
  );
}
