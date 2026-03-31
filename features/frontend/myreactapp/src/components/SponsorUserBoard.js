import "./DashBoard.css";
import { useNavigate } from "react-router-dom";

export default function SponsorUserBoard() {
    const navigate = useNavigate();
  return (
    <div className="dashboard-page">
      <div className="dashboard">

        {/* Welcome Header */}
        <div className="welcome">
          Welcome back, Sponsor User
          <span className="subtitle">Manage Drivers &amp; Catalogue</span>
        </div>

        {/* View Drivers */}
        <div className="card" onClick={() => navigate("/admin/users")}>
          <span className="card-icon">🚗</span>
          <span className="card-label">View Drivers</span>
          <span className="card-sub">Review &amp; manage drivers</span>
        </div>

        {/* Update Catalogue */}
        <div className="card" onClick={() => navigate("/catalogue")}>
          <span className="card-icon">🛒</span>
          <span className="card-label">Update Catalogue</span>
          <span className="card-sub">Add or edit products</span>
        </div>

        {/* Last Catalogue Report */}
        <div className="card" onClick={() => navigate("/catalogue-report")}>
          <span className="card-icon">📋</span>
          <span className="card-label">Last Catalogue Report</span>
          <span className="card-sub">12/20/25</span>
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
