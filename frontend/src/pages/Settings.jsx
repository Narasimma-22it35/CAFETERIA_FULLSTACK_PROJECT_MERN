import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getUserPreferences, updateUserPreferences, updateUserPassword } from '../api/userApi';

const Settings = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        pushNotifications: true,
        darkMode: false
    });
    const [loading, setLoading] = useState(true);
    
    // Password Modal State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            navigate('/auth');
            return;
        }
        setUser(userData);
        fetchPreferences(userData.email);
    }, [navigate]);

    const fetchPreferences = async (email) => {
        try {
            const { data } = await getUserPreferences(email);
            setPreferences(data);
        } catch (error) {
            console.error('Error fetching preferences:', error);
            toast.error('Could not load preferences.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (key) => {
        const newPrefs = { ...preferences, [key]: !preferences[key] };
        setPreferences(newPrefs);
        
        try {
            await updateUserPreferences(user.email, newPrefs);
            toast.success('Preference updated successfully!');
            // Simulate Dark Mode trigger based on toggle
            if (key === 'darkMode') {
                if (newPrefs.darkMode) {
                    document.body.classList.add('dark-theme');
                } else {
                    document.body.classList.remove('dark-theme');
                }
            }
        } catch (error) {
            console.error('Error updating preference:', error);
            toast.error('Failed to update preference.');
            // Revert state on failure
            setPreferences(preferences);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            return toast.error('New passwords do not match');
        }
        if (passwordData.new.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        try {
            await updateUserPassword(user.email, passwordData.current, passwordData.new);
            toast.success('Password updated successfully!');
            setShowPasswordModal(false);
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        }
    };

    if (loading) return <div className="admin-loading">Loading Settings...</div>;

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
                            <div 
                                className={`toggle-switch ${preferences.emailNotifications ? 'on' : ''}`}
                                onClick={() => handleToggle('emailNotifications')}
                            ></div>
                        </div>
                        <div className="settings-toggle">
                            <span>Push Notifications</span>
                            <div 
                                className={`toggle-switch ${preferences.pushNotifications ? 'on' : ''}`}
                                onClick={() => handleToggle('pushNotifications')}
                            ></div>
                        </div>
                        <div className="settings-toggle">
                            <span>Dark Mode</span>
                            <div 
                                className={`toggle-switch ${preferences.darkMode ? 'on' : ''}`}
                                onClick={() => handleToggle('darkMode')}
                            ></div>
                        </div>
                    </div>

                    <div className="settings-section">
                        <h3>Security</h3>
                        <button className="settings-action-link" onClick={() => setShowPasswordModal(true)}>Change Password</button>
                        <button className="settings-action-link" onClick={() => toast('2FA is coming soon!', { icon: '🔒' })}>Two-Factor Authentication</button>
                    </div>

                    <div className="settings-footer">
                        <button className="save-settings-btn" onClick={() => navigate(-1)}>Back to Dashboard</button>
                    </div>
                </motion.div>
            </main>

            {/* Password Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <motion.div 
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="payment-modal"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                        >
                            <h2>Change Password</h2>
                            <form onSubmit={handlePasswordChange} className="password-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                                <input 
                                    type="password" 
                                    placeholder="Current Password" 
                                    className="auth-input"
                                    value={passwordData.current} 
                                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                                    required
                                />
                                <input 
                                    type="password" 
                                    placeholder="New Password" 
                                    className="auth-input"
                                    value={passwordData.new} 
                                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                                    required
                                />
                                <input 
                                    type="password" 
                                    placeholder="Confirm New Password" 
                                    className="auth-input"
                                    value={passwordData.confirm} 
                                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                                    required
                                />
                                <div className="modal-actions" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button type="button" className="close-btn" onClick={() => setShowPasswordModal(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc', background: 'transparent', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" className="confirm-btn" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#bb86fc', color: '#121212', fontWeight: 'bold', cursor: 'pointer' }}>Update</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Settings;

