import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getRestaurants } from '../api/restaurants';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    useEffect(() => {
        let userData = null;
        try {
            const raw = localStorage.getItem('user');
            if (raw) userData = JSON.parse(raw);
        } catch (e) {
            console.error("Auth parsing failed");
        }

        if (!userData) {
            navigate('/auth');
            return;
        }
        setUser(userData);

        const fetchRes = async () => {
            try {
                const { data } = await getRestaurants();
                setRestaurants(data);
            } catch (err) {
                console.error("Failed to fetch restaurants");
            } finally {
                setLoading(false);
            }
        };
        fetchRes();

        // Fetch active orders for notifications
        const fetchActiveOrders = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/orders?studentId=${userData.id}`);
                const active = data.filter(o => o.status !== 'Delivered');
                setNotifications(active);
            } catch (err) { }
        };
        fetchActiveOrders();
        const interval = setInterval(fetchActiveOrders, 8000);
        return () => clearInterval(interval);
    }, [navigate]);

    const [isProfileOpen, setIsProfileOpen] = useState(false);


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.header-profile')) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth');
    };



    return (
        <div className="dashboard-container">
            {(loading || !user) ? (
                <div className="admin-loading">Loading Dashboard...</div>
            ) : (
                <>
                    {/* Header */}
                    <header className="dashboard-header">
                        <div className="header-content">
                            <Link to="/dashboard" className="header-logo">
                                <span className="logo-icon">🍽️</span>
                                <span className="logo-text">CaféSphere</span>
                            </Link>

                            <nav className="header-nav">
                                <Link to="/dashboard" className="nav-link active">Home</Link>
                                {user.role === 'admin' && <Link to="/admin" className="nav-link admin-glow">Admin Panel</Link>}
                                <Link to="/orders" className="nav-link">My Orders</Link>
                                <button
                                    onClick={() => navigate('/feedback')}
                                    className="nav-link btn-feedback"
                                    style={{ background: 'rgba(252, 128, 25, 0.1)', color: '#fc8019', border: '1px solid rgba(252, 128, 25, 0.2)', padding: '6px 15px', borderRadius: '8px', fontWeight: 'bold' }}
                                >
                                    Give Feedback
                                </button>
                            </nav>

                            <div className="header-notif-area">
                                <div className={`notif-bell ${notifications.length > 0 ? 'pulse' : ''}`} onClick={() => setIsNotifOpen(!isNotifOpen)}>
                                    🔔
                                    {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
                                </div>

                                <AnimatePresence>
                                    {isNotifOpen && (
                                        <motion.div
                                            className="notif-dropdown"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                        >
                                            <h3>Active Orders</h3>
                                            <div className="notif-list">
                                                {notifications.length === 0 ? (
                                                    <p className="no-notif">No active orders</p>
                                                ) : (
                                                    notifications.map(n => (
                                                        <div key={n._id} className="notif-item" onClick={() => navigate('/order-tracking/' + n._id)}>
                                                            <div className="notif-item-top">
                                                                <strong>#{n.orderId}</strong>
                                                                <span className="notif-status">{n.status}</span>
                                                            </div>
                                                            <p>Items: {n.items.length}</p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            <Link to="/orders" className="view-all-notif">View Order History</Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="header-profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                                <div className="profile-info">
                                    <span className="profile-name">Hello, {user.name}</span>
                                </div>
                                <div className="profile-avatar">{user.name[0]}</div>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            className="profile-dropdown"
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="dropdown-header">
                                                <span className="drop-name">{user.name}</span>
                                                <span className="drop-role">Student</span>
                                            </div>
                                            <button className="dropdown-item" onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}>
                                                <span className="item-icon">👤</span> Profile
                                            </button>
                                            <button className="dropdown-item" onClick={() => { navigate('/orders'); setIsProfileOpen(false); }}>
                                                <span className="item-icon">📦</span> My Orders
                                            </button>
                                            <button className="dropdown-item" onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}>
                                                <span className="item-icon">⚙️</span> Settings
                                            </button>
                                            <button className="dropdown-item logout" onClick={handleLogout}>
                                                <span className="item-icon">⏻</span> Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="dashboard-main">
                        <motion.div
                            className="welcome-section"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1>Find Your Favorite Food</h1>
                            <p>Discover the best meals from top-rated restaurants in your campus.</p>
                        </motion.div>

                        <motion.div
                            className="restaurant-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {restaurants.length > 0 ? restaurants.map((res, index) => (
                                <motion.div
                                    key={res._id}
                                    className="restaurant-card"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="card-image-wrapper">
                                        <img src={res.name === 'Dell' ? "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"} alt={res.name} className="card-image" />
                                        <div className="card-tag" style={{
                                            backgroundColor: res.crowdLevel === 'Low' ? '#4CAF50' :
                                                res.crowdLevel === 'Medium' ? '#FFEB3B' :
                                                    res.crowdLevel === 'High' ? '#FF9800' : '#F44336',
                                            color: (res.crowdLevel === 'Medium') ? '#000' : '#fff'
                                        }}>
                                            {res.crowdLevel}
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <div className="card-header-row">
                                            <h3 className="card-title">{res.name}</h3>
                                            <div className="card-rating">
                                                <span className="star">★</span>
                                                <span className="rating-value">{res.rating}</span>
                                            </div>
                                        </div>
                                        <p className="card-cuisine">{res.cuisine}</p>
                                        <button className="order-btn" onClick={() => navigate(`/restaurant/${res._id}`)}>
                                            Show Details
                                            <span className="btn-icon">→</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="no-restaurants">
                                    <h3>No restaurants available at the moment.</h3>
                                    <p>Please check back later or contact admin.</p>
                                </div>
                            )}
                        </motion.div>
                    </main>

                    {/* Footer */}
                    <footer className="dashboard-footer">
                        <p>© 2026 CaféSphere . All rights reserved. Made for KGKITE Students.</p>
                    </footer>
                </>
            )}
        </div>
    );
};

export default StudentDashboard;
