import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './Settings.css'; 

const Settings = () => {
    const { user } = useAuth();
    
    // Accessing the nested ID from the login response structure
    const userId = user?.user?.id;

    const [formData, setFormData] = useState({
        user_fname: '', user_lname: '', user_email: '', user_phone_number: '', user_username: ''
    });

    const [passwords, setPasswords] = useState({
        newPassword: '', confirmPassword: ''
    });

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const loadSettings = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`${process.env.REACT_APP_USER_URL}/${userId}`);
                const data = await response.json();
                setFormData(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load settings:", err);
                setLoading(false);
            }
        };
        loadSettings();
    }, [userId]);

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
                setStatus({ type: 'success', msg: 'Password updated!' });
                setPasswords({ newPassword: '', confirmPassword: '' });
            } else {
                setStatus({ type: 'error', msg: 'Failed to update password.' });
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

                <hr className="settings-divider" />
                <section className="settings-section">
                    <h2>Security</h2>
                    <form onSubmit={handlePasswordSubmit} className="settings-form">
                        <div className="form-group">
                            <label>New Password</label>
                            <input 
                                type="password" 
                                value={passwords.newPassword} 
                                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} 
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input 
                                type="password" 
                                value={passwords.confirmPassword} 
                                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} 
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