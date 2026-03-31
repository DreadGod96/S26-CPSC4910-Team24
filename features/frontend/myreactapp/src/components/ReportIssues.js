import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DashBoard.css";

export default function ReportIssues() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", category: "bug", description: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard">
        <div className="welcome">
          Report an Issue
          <span className="subtitle">Flag &amp; track problems</span>
        </div>

        <button
          className="btn btn-sm"
          style={{ marginBottom: "1rem", alignSelf: "flex-start" }}
          onClick={() => navigate("/adboard")}
        >
          ← Back to Dashboard
        </button>

        {submitted ? (
          <div style={{ background: "#e8f5e9", borderRadius: "8px", padding: "24px", textAlign: "center" }}>
            <p style={{ fontSize: "1.2rem", color: "#2e7d32", fontWeight: 600 }}>Issue submitted successfully!</p>
            <button className="btn btn-sm" style={{ marginTop: "12px" }} onClick={() => setSubmitted(false)}>
              Submit another
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ background: "#fff", borderRadius: "8px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", width: "100%", maxWidth: "560px" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontWeight: 600 }}>Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Brief description of the issue"
                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontWeight: 600 }}>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
              >
                <option value="bug">Bug / Error</option>
                <option value="account">Account Issue</option>
                <option value="points">Points Discrepancy</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontWeight: 600 }}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Describe the issue in detail..."
                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem", resize: "vertical" }}
              />
            </div>

            <button type="submit" className="btn btn-sm" style={{ alignSelf: "flex-start" }}>
              Submit Issue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
