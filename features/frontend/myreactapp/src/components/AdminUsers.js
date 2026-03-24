import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  fetch(process.env.REACT_APP_USER_URL)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setUsers(Array.isArray(data) ? data : []);
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
      setUsers([]);
    });
}, []);

  const drivers = users.filter((u) => u.user_role === "driver");
  const sponsors = users.filter((u) => u.user_role === "sponsor");
  const admins = users.filter((u) => u.user_role === "admin");

  const renderUserCard = (user) => (
    <div
      key={user.user_ID}
      className="user-card"
      onClick={() => navigate(`/admin/users/${user.user_ID}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="user-name">
        {user.user_fname} {user.user_lname}
      </div>
      <div className="user-email">{user.user_email}</div>
    </div>
  );

  return (
    <div className="admin-users-page">
      <div className="admin-users-container">
        <h1 className="admin-users-title">Manage Users</h1>
        <p className="admin-users-subtitle">
          View drivers, sponsors, and admins
        </p>

        <div className="user-section">
          <h2>Drivers</h2>
          <div className="user-grid">
            {drivers.length > 0 ? drivers.map(renderUserCard) : <p>No drivers found.</p>}
          </div>
        </div>

        <div className="user-section">
          <h2>Sponsors</h2>
          <div className="user-grid">
            {sponsors.length > 0 ? sponsors.map(renderUserCard) : <p>No sponsors found.</p>}
          </div>
        </div>

        <div className="user-section">
          <h2>Admins</h2>
          <div className="user-grid">
            {admins.length > 0 ? admins.map(renderUserCard) : <p>No admins found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}