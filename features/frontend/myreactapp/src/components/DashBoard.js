import React from "react";
import "./DashBoard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="dashboard">

        {/* Welcome Header */}
        <div className="welcome">
          Welcome back, Driver
          <span className="subtitle">Good Driver Incentive Program</span>
        </div>

        {/* Points Summary */}
        <div className="card">
          <span className="card-icon">⭐</span>
          <span className="card-label">Total Points</span>
          <span className="card-sub">12,000 pts</span>
        </div>

        {/* Last Point Update */}
        <div className="card">
          <span className="card-icon">📈</span>
          <span className="card-label">Last Update</span>
          <span className="card-sub">+300 pts<br />on 12/20/25</span>
        </div>

        {/* Browse Catalogue */}
        <div className="card">
          <span className="card-icon">🍕</span>
          <span className="card-label">Browse Catalogue</span>
          <span className="card-sub">Redeem your points</span>
        </div>

        {/* Account Settings */}
        <div className="card">
          <span className="card-icon">⚙️</span>
          <span className="card-label">Account Settings</span>
          <span className="card-sub">Profile &amp; password</span>
        </div>

      </div>
    </div>
  );
}