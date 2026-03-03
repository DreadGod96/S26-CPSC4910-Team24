import { useNavigate } from "react-router-dom";
import "./DashBoard.css";
export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="dashboard">
      <div className="welcome">Welcome back, Admin</div>

      <div
        className="card small"
        onClick={() => navigate("/create-account")}
        style={{ cursor: "pointer" }}
      >
        <p>Manage Accounts</p>
      </div>

      <div className="card large">Manage Catalogs</div>

      <div className="card large">Report Issues</div>

      <div className="card large">Account Settings</div>
    </div>
  );
}
