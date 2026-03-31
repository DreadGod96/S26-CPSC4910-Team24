import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./DashBoard.css";

const statusColor = {
  Submitted: "#1565c0",
  Approved:  "#2e7d32",
  Rejected:  "#c62828",
  Pending:   "#e65100",
};

export default function MyApplications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    const url = `${process.env.REACT_APP_APPLICATION_URL}/driver/${user.id}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setApplications(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching applications:", err);
        setError("Could not load your applications. Please try again later.");
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="dashboard-page">
      <div className="dashboard">
        <div className="welcome">
          My Applications
          <span className="subtitle">Applications you have submitted</span>
        </div>

        <button
          className="btn btn-sm"
          style={{ marginBottom: "1rem", alignSelf: "flex-start" }}
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        {loading && <p>Loading...</p>}

        {error && (
          <p style={{ color: "#c62828" }}>{error}</p>
        )}

        {!loading && !error && applications.length === 0 && (
          <div style={{ background: "#fff", borderRadius: "8px", padding: "24px", textAlign: "center" }}>
            <p style={{ color: "#666" }}>You have not submitted any applications yet.</p>
            <button
              className="btn btn-sm"
              style={{ marginTop: "12px" }}
              onClick={() => navigate("/apply")}
            >
              Apply Now
            </button>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden" }}>
            <thead>
              <tr style={{ background: "#4a90d9", color: "#fff" }}>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>ID</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Title</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Sponsor</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Date</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.application_ID} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px 16px", fontFamily: "monospace" }}>#{app.application_ID}</td>
                  <td style={{ padding: "12px 16px" }}>{app.application_name}</td>
                  <td style={{ padding: "12px 16px" }}>{app.company_name ?? "—"}</td>
                  <td style={{ padding: "12px 16px" }}>{app.application_date ? new Date(app.application_date).toLocaleDateString() : "—"}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: statusColor[app.application_status] ?? "#333" }}>
                    {app.application_status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
