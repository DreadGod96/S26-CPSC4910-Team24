import React from "react";
import "./DashBoard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <div className="dashboard">

        {/* Welcome Header */}
        <div className="welcome">
          Welcome back, Driver
          <span className="subtitle">Good Driver Incentive Program</span>
        </div>

        {/* Points Summary */}
        <div className="card" onClick={() => navigate("/points")}>
          <span className="card-icon">⭐</span>
          <span className="card-label">Total Points</span>
          <span className="card-sub">12,000 pts</span>
        </div>

        {/* Last Point Update */}
        <div className="card" onClick={() => navigate("/points")}>
          <span className="card-icon">📈</span>
          <span className="card-label">Last Update</span>
          <span className="card-sub">+300 pts<br />on 12/20/25</span>
        </div>

        {/* Browse Catalogue */}
        <div className="card" onClick={() => navigate("/catalogue")}>
          <span className="card-icon">🍕</span>
          <span className="card-label">Browse Catalogue</span>
          <span className="card-sub">Redeem your points</span>
        </div>

        {/* My Applications */}
        <div className="card" onClick={() => navigate("/my-applications")}>
          <span className="card-icon">📋</span>
          <span className="card-label">My Applications</span>
          <span className="card-sub">View submitted applications</span>
        </div>

        {/* Account Settings */}
        <div className="card" onClick={() => navigate("/settings")}>
          <span className="card-icon">⚙️</span>
          <span className="card-label">Account Settings</span>
          <span className="card-sub">Profile &amp; password</span>
        </div>

      </div>
    </div>
  );
}
