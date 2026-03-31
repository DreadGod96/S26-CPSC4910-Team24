import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./AdminUserDetails.css";

export default function AdminUserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pointsValue, setPointsValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(`${process.env.REACT_APP_USER_URL}/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch user: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Failed to load user details.");
        setLoading(false);
      });
  }, [id]);

  const startEditing = (field, currentValue) => {
    setEditingField(field);
    setEditedValue(currentValue ?? "");
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditedValue("");
  };

  const saveEdit = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_USER_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field: editingField,
          value: editedValue === "" ? null : editedValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setEditingField(null);
      setEditedValue("");
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user.");
    }
  };

  const handleDeleteClick = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to deactivate this account?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(`${process.env.REACT_APP_USER_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();

    console.log("DELETE status:", response.status);
    console.log("DELETE response:", text);

    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.status} - ${text}`);
    }

    alert("User deleted successfully.");
    navigate("/admin/users");
  } catch (err) {
    console.error("Error deleting user:", err);
    alert(err.message || "Failed to delete user.");
  }
};

  const handlePointsSave = () => {
    alert("Driver points backend is not connected yet.");
  };

  const renderEditableRow = (label, field, value, type = "text") => (
    <div className="detail-row">
      <span className="detail-label">{label}</span>

      {editingField === field ? (
        <div className="detail-content">
          <input
            className="detail-input"
            type={type}
            value={editedValue ?? ""}
            onChange={(e) => setEditedValue(e.target.value)}
          />
          <button className="save-button" onClick={saveEdit}>
            Save
          </button>
          <button className="cancel-button" onClick={cancelEditing}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="detail-content">
          <span className="detail-value">{value ?? "—"}</span>
          <button
            className="edit-button"
            onClick={() => startEditing(field, value)}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );

  const renderReadOnlyRow = (label, value) => (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value ?? "—"}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-user-details-page">
        <div className="admin-user-details-container">
          <p className="loading-text">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-user-details-page">
        <div className="admin-user-details-container">
          <p className="error-text">{error}</p>
          <Link to="/admin/users" className="back-button">
            ← Back to Users
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-user-details-page">
        <div className="admin-user-details-container">
          <p className="loading-text">User not found.</p>
          <Link to="/admin/users" className="back-button">
            ← Back to Users
          </Link>
        </div>
      </div>
    );
  }

  const isDriver = user.user_role?.toLowerCase() === "driver";

  return (
    <div className="admin-user-details-page">
      <div className="admin-user-details-container">
        <div className="details-header">
          <div>
            <h1 className="details-title">User Details</h1>
            <p className="details-subtitle">
              View account information for this user
            </p>
          </div>

          <Link to="/admin/users" className="back-button">
            ← Back to Users
          </Link>
        </div>

        <div className="details-card">
          <div className="details-card-top">
            <div>
              <h2 className="details-name">
                {user.user_fname} {user.user_lname}
              </h2>
              <p className="details-role">{user.user_role}</p>
            </div>

            <button className="delete-user-button" onClick={handleDeleteClick}>
              Delete Account
            </button>
          </div>

          <div className="details-grid">
            {renderReadOnlyRow("ID", user.user_ID)}
            {renderEditableRow("First Name", "user_fname", user.user_fname)}
            {renderEditableRow("Last Name", "user_lname", user.user_lname)}
            {renderEditableRow("Email", "user_email", user.user_email, "email")}
            {renderEditableRow("Username", "user_username", user.user_username)}
            {renderEditableRow("Phone", "user_phone_number", user.user_phone_number)}
            {renderEditableRow("Role", "user_role", user.user_role)}
            {renderEditableRow(
              "Join Date",
              "user_join_date",
              user.user_join_date
                ? new Date(user.user_join_date).toISOString().split("T")[0]
                : "",
              "date"
            )}
            {renderEditableRow(
              "End Date",
              "user_end_date",
              user.user_end_date
                ? new Date(user.user_end_date).toISOString().split("T")[0]
                : "",
              "date"
            )}
            {renderEditableRow("Company ID", "company_ID", user.company_ID, "number")}
          </div>
        </div>

        <div className="details-card">
          <h2 className="section-title">Driver Points</h2>

          {isDriver ? (
            <>
              <div className="detail-row">
                <span className="detail-label">Current Points</span>
                <span className="detail-value">
                  {user.point_total ?? "Not connected yet"}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Adjust Points</span>
                <div className="detail-content">
                  <input
                    className="detail-input"
                    type="number"
                    value={pointsValue}
                    onChange={(e) => setPointsValue(e.target.value)}
                    placeholder="Enter new point total"
                  />
                  <button className="save-button" onClick={handlePointsSave}>
                    Save Points
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="detail-value">
              Points are only shown for driver accounts.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}