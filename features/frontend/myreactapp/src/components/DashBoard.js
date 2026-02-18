import React from "react";
import "./DashBoard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="welcome">Welcome back, Driver</div>

      <div className="card small">
        <p>Total Points: 12000</p>
      </div>

      <div className="card large">Browse Catalog</div>

      <div className="card small">
        <p>
          Last Point Update:
          <br />
          +300 on 12/20/25
        </p>
      </div>

      <div className="card large">Account Settings</div>
    </div>
  );
}
