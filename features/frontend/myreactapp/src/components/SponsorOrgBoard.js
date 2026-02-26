import "./DashBoard.css";
export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="welcome">Welcome back, Sponsor</div>

      <div className="card small">
        <p>Manage sponor users</p>
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
