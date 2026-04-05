import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './Settings.css'; 

const Settings = () => {
    const { user } = useAuth();

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

    // 1. Fetch current profile data
    useEffect(() => {
        const loadSettings = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`${process.env.REACT_APP_USER_URL}/${userId}`);
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
                console.error("Failed to load settings:", err);
                setStatus({ type: 'error', msg: 'Failed to load profile.' });
                setLoading(false);
            }
        };
        loadSettings();
    }, [userId]);

    // 2. Handle Profile Changes
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'info', msg: 'Updating profile...' });
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
            setStatus({ type: 'error', msg: 'Network error.' });
        }
    };

    // 3. Handle Password Changes
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setStatus({ type: 'error', msg: 'Passwords do not match.' });
            return;
        }
        if (passwords.newPassword.length < 6) {
            setStatus({ type: 'error', msg: 'Password must be at least 6 characters.' });
            return;
        }

        setStatus({ type: 'info', msg: 'Updating password...' });
        try {
            const response = await fetch(`${process.env.REACT_APP_USER_URL}/change-password/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword: passwords.newPassword, confirmPassword: passwords.confirmPassword })
            });
            if (response.ok) {
                setStatus({ type: 'success', msg: 'Password changed successfully!' });
                setPasswords({ newPassword: '', confirmPassword: '' });
            } else {
                setStatus({ type: 'error', msg: 'Failed to update password.' });
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'Server error.' });
        }
    };

    if (loading) return <div className="loading-screen">Loading your profile...</div>;

    return (
        <div className="settings-page">
            <div className="settings-container">
                <h1 className="settings-title">Account Settings</h1>
                
                {status && <div className={`status-banner ${status.type}`}>{status.msg}</div>}

                {/* --- SECTION 1: PROFILE --- */}
                <section className="settings-section">
                    <h2>Profile Information</h2>
                    <form onSubmit={handleProfileSubmit} className="settings-form">
                        <div className="form-group">
                            <label>Username</label>
                            <input name="user_username" value={formData.user_username} disabled className="disabled-input" />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input name="user_fname" value={formData.user_fname} onChange={(e) => setFormData({...formData, user_fname: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input name="user_lname" value={formData.user_lname} onChange={(e) => setFormData({...formData, user_lname: e.target.value})} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input name="user_email" type="email" value={formData.user_email} onChange={(e) => setFormData({...formData, user_email: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input name="user_phone_number" value={formData.user_phone_number} onChange={(e) => setFormData({...formData, user_phone_number: e.target.value})} />
                        </div>
                        <button type="submit" className="save-btn">Save Profile Changes</button>
                    </form>
                </section>

                <hr className="settings-divider" />

                {/* --- SECTION 2: SECURITY --- */}
                <section className="settings-section">
                    <h2>Security</h2>
                    <form onSubmit={handlePasswordSubmit} className="settings-form">
                        <div className="form-group">
                            <label>New Password</label>
                            <input 
                                type="password" 
                                value={passwords.newPassword} 
                                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} 
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input 
                                type="password" 
                                value={passwords.confirmPassword} 
                                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} 
                                placeholder="Repeat new password"
                            />
                        </div>
                        <button type="submit" className="save-btn secondary">Change Password</button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default Settings;