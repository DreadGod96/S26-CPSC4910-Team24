import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './Settings.css'; 

const Settings = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        user_fname: '',
        user_lname: '',
        user_email: '',
        user_phone_number: '',
        user_username: ''
    });
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);

    //Load current settings from your redrafted backend
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_USER_URL}/${user.user_ID}`);
                const data = await response.json();
                setFormData(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load settings:", err);
            }
        };
        if (user?.user_ID) loadSettings();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    //Save using the BULK update logic 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'info', msg: 'Saving...' });
        try {
            const response = await fetch(`${process.env.REACT_APP_USER_URL}/settings/${user.user_ID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setStatus({ type: 'success', msg: 'Settings updated successfully!' });
            } else {
                setStatus({ type: 'error', msg: 'Failed to update settings.' });
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'Network error occurred.' });
        }
    };

    if (loading) return <div className="loading">Loading Profile...</div>;

    return (
        <div className="settings-page">
            <div className="settings-container">
                <h1 className="settings-title">Account Settings</h1>
                {status && <div className={`status-banner ${status.type}`}>{status.msg}</div>}
                
                <form onSubmit={handleSubmit} className="settings-form">
                    <div className="form-group">
                        <label>First Name</label>
                        <input name="user_fname" value={formData.user_fname} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input name="user_lname" value={formData.user_lname} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input name="user_email" type="email" value={formData.user_email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input name="user_phone_number" value={formData.user_phone_number} onChange={handleChange} />
                    </div>
                    <button type="submit" className="save-btn">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
