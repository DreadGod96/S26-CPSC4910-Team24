import { useNavigate } from "react-router-dom";
import "./DashBoard.css";

export default function SponsorOrgBoard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <div className="dashboard">

        {/* Welcome Header */}
        <div className="welcome">
          Welcome back, Sponsor
          <span className="subtitle">Organization Dashboard</span>
        </div>

        {/* Manage Sponsor Users */}
        <div
          className="card"
          onClick={() => navigate("/sponsboard")}
        >
          <span className="card-icon">👤</span>
          <span className="card-label">Manage Sponsor Users</span>
          <span className="card-sub">Add &amp; review users</span>
        </div>

        {/* View Order History */}
        <div className="card" onClick={() => navigate("/order-history")}>
          <span className="card-icon">🧾</span>
          <span className="card-label">Order History</span>
          <span className="card-sub">Review past orders</span>
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

                {/* Audit Logs */}
        <div className="card" onClick={() => navigate("/admin/audit")}>
          <span className="card-icon">📋</span>
          <span className="card-label">Audit Logs</span>
          <span className="card-sub">View system &amp; security events</span>
        </div>

        {/* Financial Reports */}
        <div className="card" onClick={() => navigate("/admin/reports")}>
          <span className="card-icon">📊</span>
          <span className="card-label">Financial Reports</span>
          <span className="card-sub">Sales, Invoices &amp; Fees</span>
        </div>
          
      <div className="card" onClick={() => navigate("/readapp")}>
        Review applications
      </div>
          
      </div>
    </div>
  );
}
