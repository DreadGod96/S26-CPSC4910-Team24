import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './Settings.css'; 

const Settings = () => {
    const { user } = useAuth();
    
    // The user's sessionStorage is nested: { "user": { "id": 66, ... } }
    const userId = user?.user?.id;

    const [formData, setFormData] = useState({
        user_fname: '',
        user_lname: '',
        user_email: '',
        user_phone_number: '',
        user_username: ''
    });

    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);

    // Load current settings from the user_service
    useEffect(() => {
        const loadSettings = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`${process.env.REACT_APP_USER_URL}/${userId}`);
                if (!response.ok) throw new Error("Failed to fetch user data");
                
                const data = await response.json();
                setFormData({
                    user_fname: data.user_fname || '',
                    user_lname: data.user_lname || '',
                    user_email: data.user_email || '',
                    user_phone_number: data.user_phone_number || '',
                    user_username: data.user_username || ''
                });
                setLoading(false);
            } catch (err) {
                console.error("Error loading settings:", err);
                setStatus({ type: 'error', msg: 'Could not load profile data.' });
                setLoading(false);
            }
        };

        loadSettings();
    }, [userId]);

    const handleProfileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    // Save Profile Changes
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'info', msg: 'Saving profile...' });
        try {
            const response = await fetch(`${process.env.REACT_APP_USER_URL}/settings/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus({ type: 'success', msg: 'Profile updated successfully!' });
            } else {
                setStatus({ type: 'error', msg: 'Failed to update profile.' });
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'Network error occurred.' });
        }
    };

    // Change Password
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setStatus({ type: 'error', msg: 'Passwords do not match.' });
            return;
        }

        setStatus({ type: 'info', msg: 'Updating password...' });
        try {
            const response = await fetch(`${process.env.REACT_APP_USER_URL}/change-password/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(passwords)
            });

            if (response.ok) {
                setStatus({ type: 'success', msg: 'Password updated successfully!' });
                setPasswords({ newPassword: '', confirmPassword: '' });
            } else {
                setStatus({ type: 'error', msg: 'Failed to update password.' });
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'Network error occurred.' });
        }
    };

    if (loading) return <div className="loading-screen">Loading your profile...</div>;

    return (
        <div className="settings-page">
            <div className="settings-container">
                <h1 className="settings-title">Account Settings</h1>
                
                {status && (
                    <div className={`status-banner ${status.type}`}>
                        {status.msg}
                    </div>
                )}
                
                <section className="settings-section">
                    <h2>Profile Information</h2>
                    <form onSubmit={handleProfileSubmit} className="settings-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input name="user_fname" value={formData.user_fname} onChange={handleProfileChange} />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input name="user_lname" value={formData.user_lname} onChange={handleProfileChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input name="user_email" type="email" value={formData.user_email} onChange={handleProfileChange} />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input name="user_phone_number" value={formData.user_phone_number} onChange={handleProfileChange} />
                        </div>
                        <button type="submit" className="save-btn">Update Profile</button>
                    </form>
                </section>

                <hr className="settings-divider" />

                <section className="settings-section">
                    <h2>Security</h2>
                    <form onSubmit={handlePasswordSubmit} className="settings-form">
                        <div className="form-group">
                            <label>New Password</label>
                            <input 
                                type="password" 
                                name="newPassword" 
                                value={passwords.newPassword} 
                                onChange={handlePasswordChange} 
                                placeholder="Min 6 characters"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                value={passwords.confirmPassword} 
                                onChange={handlePasswordChange} 
                            />
                        </div>
                        <button type="submit" className="save-btn secondary">Update Password</button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default Settings;
