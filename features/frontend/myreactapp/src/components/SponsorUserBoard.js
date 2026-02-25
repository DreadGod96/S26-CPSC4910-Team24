import "./DashBoard.css";
export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="welcome">Welcome back, Sponsor user</div>

      <div className="card small">
        <p>View Drivers</p>
      </div>

      <div className="card large">Update Catalog</div>

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
