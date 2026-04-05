import { useNavigate } from "react-router-dom";
import "./DashBoard.css";

export default function AdminBoard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <div className="dashboard">

        {/* Welcome Header */}
        <div className="welcome">
          Welcome back, Admin
          <span className="subtitle">System Administration</span>
        </div>

        {/* Manage Accounts */}
        <div className="card" onClick={() => navigate("/admin/users")}>
          <span className="card-icon">👥</span>
          <span className="card-label">Manage Accounts</span>
          <span className="card-sub">Create &amp; edit users</span>
        </div>

        {/* Manage Catalogues */}
        <div className="card" onClick={() => navigate("/catalogue")}>
          <span className="card-icon">📦</span>
          <span className="card-label">Manage Catalogues</span>
          <span className="card-sub">Sponsor products</span>
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

        {/* Report Issues */}
        <div className="card" onClick={() => navigate("/report-issues")}>
          <span className="card-icon">🚩</span>
          <span className="card-label">Report Issues</span>
          <span className="card-sub">Flag &amp; track problems</span>
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