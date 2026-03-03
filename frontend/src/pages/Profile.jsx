import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
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

    if (!user) return <div className="admin-loading">Loading Profile...</div>;

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

            <main className="dashboard-main profile-page-content">
                <motion.div
                    className="profile-card-large"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="profile-hero-section">
                        <div className="profile-avatar-large">{user.name[0]}</div>
                        <h2>{user.name}</h2>
                        <span className="profile-badge-role">{user.role}</span>
                    </div>

                    <div className="profile-details-grid">
                        <div className="detail-item">
                            <label>Full Name</label>
                            <p>{user.name}</p>
                        </div>
                        <div className="detail-item">
                            <label>Email Address</label>
                            <p>{user.email}</p>
                        </div>
                        <div className="detail-item">
                            <label>Account Status</label>
                            <p className="status-active">Active</p>
                        </div>
                        <div className="detail-item">
                            <label>Member Since</label>
                            <p>March 2026</p>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="edit-profile-btn" onClick={() => alert('Profile editing coming soon!')}>Edit Profile</button>
                        <button className="back-btn-profile" onClick={() => navigate(-1)}>Go Back</button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Profile;
