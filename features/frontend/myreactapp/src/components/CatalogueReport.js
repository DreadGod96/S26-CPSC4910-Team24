import React from "react";
import { useNavigate } from "react-router-dom";
import "./DashBoard.css";

const report = {
  generatedAt: "12/20/25",
  sponsor: "Good Driver Incentive Program",
  totalItems: 42,
  categories: [
    { name: "Pizza", items: 18, avgPoints: 2400 },
    { name: "Pasta", items: 8, avgPoints: 1800 },
    { name: "Sides", items: 10, avgPoints: 900 },
    { name: "Desserts", items: 6, avgPoints: 700 },
  ],
};

export default function CatalogueReport() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <div className="dashboard">
        <div className="welcome">
          Catalogue Report
          <span className="subtitle">Generated {report.generatedAt}</span>
        </div>

        <button
          className="btn btn-sm"
          style={{ marginBottom: "1rem", alignSelf: "flex-start" }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div style={{ background: "#fff", borderRadius: "8px", padding: "20px", width: "100%", marginBottom: "16px" }}>
          <p><strong>Sponsor:</strong> {report.sponsor}</p>
          <p><strong>Report Date:</strong> {report.generatedAt}</p>
          <p><strong>Total Items:</strong> {report.totalItems}</p>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#4a90d9", color: "#fff" }}>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Category</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>Items</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>Avg. Points</th>
            </tr>
          </thead>
          <tbody>
            {report.categories.map((c) => (
              <tr key={c.name} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px 16px" }}>{c.name}</td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>{c.items}</td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>{c.avgPoints.toLocaleString()} pts</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
