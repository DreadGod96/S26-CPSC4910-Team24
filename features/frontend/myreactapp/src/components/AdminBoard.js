import "./DashBoard.css";
export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="welcome">Welcome back, Admin</div>

      <div className="card small">
        <p>Manage accounts</p>
      </div>

      <div className="card large">Manage Catalogs</div>

      <div className="card large">Report Issues</div>

      <div className="card large">Account Settings</div>
    </div>
  );
}
