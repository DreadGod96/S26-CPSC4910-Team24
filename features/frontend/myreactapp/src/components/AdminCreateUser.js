import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminCreateUser.css";

export default function AdminCreateUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_fname: "",
    user_lname: "",
    user_email: "",
    user_username: "",
    user_phone_number: "",
    user_role: "driver",
    user_join_date: "",
    user_end_date: "",
    company_ID: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.user_fname.trim()) return "First name is required.";
    if (!formData.user_lname.trim()) return "Last name is required.";
    if (!formData.user_email.trim()) return "Email is required.";
    if (!formData.user_username.trim()) return "Username is required.";
    if (!formData.user_role.trim()) return "Role is required.";
    return "";
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
        setError(validationError);
        return;
    }

    setLoading(true);

    try {
        const payload = {
        username: formData.user_username,
        password: formData.password,
        first_name: formData.user_fname,
        last_name: formData.user_lname,
        email: formData.user_email,
        phone: formData.user_phone_number,
        role: formData.user_role,
        company_ID:
            formData.company_ID === "" ? null : Number(formData.company_ID),
        };

        console.log("Sending payload:", payload);

        const response = await fetch(process.env.REACT_APP_REGISTER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        });

        if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to create user: ${response.status} - ${text}`);
        }

        const createdUser = await response.json();
        setSuccess("User created successfully.");

        setTimeout(() => {
        navigate("/admin/users");
        }, 1000);
    } catch (err) {
        console.error("Error creating user:", err);
        setError(err.message || "Failed to create account.");
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="admin-create-user-page">
      <div className="admin-create-user-container">
        <div className="create-user-header">
          <div>
            <h1 className="create-user-title">Create Account</h1>
            <p className="create-user-subtitle">
              Add a new driver, sponsor, or admin account
            </p>
          </div>

          <Link to="/admin/users" className="back-button">
            ← Back to Users
          </Link>
        </div>

        <div className="create-user-card">
          <form className="create-user-form" onSubmit={handleSubmit}>
            <div className="create-user-grid">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="user_fname"
                  value={formData.user_fname}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="user_lname"
                  value={formData.user_lname}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="user_username"
                  value={formData.user_username}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="user_phone_number"
                  value={formData.user_phone_number}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  name="user_role"
                  value={formData.user_role}
                  onChange={handleChange}
                >
                  <option value="driver">Driver</option>
                  <option value="sponsor">Sponsor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label>Join Date</label>
                <input
                  type="date"
                  name="user_join_date"
                  value={formData.user_join_date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="user_end_date"
                  value={formData.user_end_date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Company ID</label>
                <input
                  type="number"
                  name="company_ID"
                  value={formData.company_ID}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && <p className="form-message error-message">{error}</p>}
            {success && <p className="form-message success-message">{success}</p>}

            <div className="form-actions">
              <button type="submit" className="create-submit-button" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}