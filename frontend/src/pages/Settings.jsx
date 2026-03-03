import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            navigate('/auth');
            return;
        }
        setUser(userData);
    }, [navigate]);

    if (!user) return <div className="admin-loading">Loading Settings...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <Link to="/dashboard" className="header-logo">
                        <span className="logo-icon">🍽️</span>
                        <span className="logo-text">CaféSphere</span>
                    </Link>
                </div>
            </header>

            <main className="dashboard-main settings-page-content">
                <motion.div
                    className="settings-card-large"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1>Account Settings ⚙️</h1>

                    <div className="settings-section">
                        <h3>Preferences</h3>
                        <div className="settings-toggle">
                            <span>Email Notifications</span>
                            <div className="toggle-switch on"></div>
                        </div>
                        <div className="settings-toggle">
                            <span>Push Notifications</span>
                            <div className="toggle-switch on"></div>
                        </div>
                        <div className="settings-toggle">
                            <span>Dark Mode</span>
                            <div className="toggle-switch on"></div>
                        </div>
                    </div>

                    <div className="settings-section">
                        <h3>Security</h3>
                        <button className="settings-action-link">Change Password</button>
                        <button className="settings-action-link">Two-Factor Authentication</button>
                    </div>

                    <div className="settings-footer">
                        <button className="save-settings-btn" onClick={() => navigate(-1)}>Save Changes</button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Settings;
