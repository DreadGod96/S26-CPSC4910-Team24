import { useNavigate } from "react-router-dom";
import "./DashBoard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="welcome">Welcome back, Sponsor</div>

      {/* Onclick handling */}
      <div
        className="card small"
        onClick={() => navigate("/sponsboard")}
        style={{ cursor: "pointer" }}
      >
        <p>Manage sponsor users</p>
      </div>

      <div className="card large">View Order history</div>

      <div className="card small">
        <p>
          Last catalog report
          <br />
          12/20/25
        </p>
      </div>

      <div className="card large">Account Settings</div>
    </div>
  );
}
