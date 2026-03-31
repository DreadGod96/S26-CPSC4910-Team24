import React from "react";
import { useNavigate } from "react-router-dom";
import "./DashBoard.css";

export default function PointsHistory() {
  const navigate = useNavigate();

  const history = [
    { date: "12/20/25", description: "Safe driving bonus", points: "+300" },
    { date: "12/10/25", description: "Monthly performance reward", points: "+500" },
    { date: "11/28/25", description: "Referral bonus", points: "+200" },
    { date: "11/15/25", description: "Safe driving bonus", points: "+300" },
    { date: "10/30/25", description: "Monthly performance reward", points: "+500" },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard">
        <div className="welcome">
          Points History
          <span className="subtitle">Total: 12,000 pts</span>
        </div>

        <button
          className="btn btn-sm"
          style={{ marginBottom: "1rem", alignSelf: "flex-start" }}
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#4a90d9", color: "#fff" }}>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Description</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px 16px" }}>{row.date}</td>
                <td style={{ padding: "12px 16px" }}>{row.description}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", color: "#2e7d32", fontWeight: 600 }}>{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
