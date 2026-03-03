import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getRestaurants, getRestaurantDetails, updateCrowdStatus, updateMenuItem, bulkUpdateStock } from '../api/restaurants';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRes, setSelectedRes] = useState(null);
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('BREAKFAST');
    const [mainTab, setMainTab] = useState('menu'); // 'menu', 'orders', or 'feedbacks'
    const [orders, setOrders] = useState([]);
    const [updateLogs, setUpdateLogs] = useState([]);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || userData.role !== 'admin') {
            toast.error('Admin access required');
            navigate('/auth');
            return;
        }
        setUser(userData);
        fetchRestaurants();
        fetchOrders();

        let interval;
        if (autoRefresh) {
            interval = setInterval(() => {
                if (selectedRes) fetchSilentUpdates(selectedRes);
                fetchOrders();
            }, 10000);
        }
        return () => clearInterval(interval);
    }, [autoRefresh, selectedRes]);

    useEffect(() => {
        if (mainTab === 'feedbacks') {
            fetchFeedbacks();
        }
    }, [mainTab]);

    const fetchFeedbacks = async () => {
        setLoadingFeedback(true);
        try {
            const { data } = await axios.get('http://localhost:5000/api/feedback');
            setFeedbacks(data);
        } catch (err) {
            toast.error('Failed to load feedbacks');
        } finally {
            setLoadingFeedback(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/orders');
            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch orders");
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
            toast.success(`Order ${newStatus}`);
            fetchOrders();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const fetchSilentUpdates = async (id) => {
        try {
            const { data } = await getRestaurantDetails(id);
            setDetails(data);
        } catch (err) { }
    };

    const fetchRestaurants = async () => {
        try {
            const { data } = await getRestaurants();
            setRestaurants(data);
            if (data.length > 0 && !selectedRes) {
                handleSelectRestaurant(data[0]._id);
            }
        } catch (err) {
            toast.error('Failed to fetch restaurants');
        }
    };

    const handleSelectRestaurant = async (id) => {
        setLoading(true);
        try {
            const { data } = await getRestaurantDetails(id);
            setDetails(data);
            setSelectedRes(id);
        } catch (err) {
            toast.error('Failed to fetch details');
        } finally {
            setLoading(false);
        }
    };

    const handleCrowdUpdate = async (field, value) => {
        try {
            const { data } = await updateCrowdStatus(selectedRes, { [field]: value });
            setDetails(data);
            const newLog = `${field === 'crowdLevel' ? 'Status' : 'Count'} changed to ${value} at ${new Date().toLocaleTimeString()}`;
            setUpdateLogs(prev => [newLog, ...prev].slice(0, 3));
            toast.success('Crowd status updated');
        } catch (err) {
            toast.error('Update failed');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth');
    };

    const handleMenuItemUpdate = async (itemId, updates) => {
        try {
            const { data } = await updateMenuItem(selectedRes, itemId, updates);
            setDetails(data);
            toast.success('Item updated');
        } catch (err) {
            toast.error('Update failed');
        }
    };

    return (
        <div className="admin-dashboard-container">
            {(!user) ? (
                <div className="admin-loading">Loading Admin Panel...</div>
            ) : (
                <>
                    <header className="admin-header">
                        <div className="admin-header-content">
                            <div className="admin-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                                <span className="logo-icon">👑</span>
                                <div className="logo-texts">
                                    <h3>CaféSphere</h3>
                                    <span>ADMIN CONTROL</span>
                                </div>
                            </div>

                            <div className="admin-header-center">
                                <span className="student-view-label">LOCATIONS</span>
                                <div className="restaurant-selector-pills">
                                    {restaurants.map(r => (
                                        <button
                                            key={r._id}
                                            className={`restaurant-pill ${selectedRes === r._id ? 'active' : ''}`}
                                            onClick={() => handleSelectRestaurant(r._id)}
                                        >
                                            <span className="pill-dot"></span>
                                            {r.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="header-profile admin" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                                <div className="profile-info">
                                    <span className="profile-name">System Admin</span>
                                    <span className="profile-role">administrator</span>
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
                                                <span className="drop-name">System Admin</span>
                                                <span className="drop-role">Administrator</span>
                                            </div>
                                            <button className="dropdown-item" onClick={() => { navigate('/dashboard'); setIsProfileOpen(false); }}>
                                                <span className="item-icon">🏠</span> Student Dashboard
                                            </button>
                                            <button className="dropdown-item" onClick={() => { navigate('/admin/profile'); setIsProfileOpen(false); }}>
                                                <span className="item-icon">👤</span> Admin Profile
                                            </button>
                                            <button className="dropdown-item" onClick={() => { navigate('/admin/settings'); setIsProfileOpen(false); }}>
                                                <span className="item-icon">⚙️</span> System Settings
                                            </button>
                                            {/* Logout button removed as per User Request #9 */}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </header>

                    <main className="dashboard-main admin-main">
                        {!selectedRes ? (
                            <div className="admin-empty-state">
                                <h2>Welcome, Admin! 👑</h2>
                                <p>Please select a restaurant from the top to manage its menu, orders, and crowd status.</p>
                                {restaurants.length === 0 && (
                                    <div className="setup-hint">
                                        <p>No restaurants detected in database. Please run seed script or add via API.</p>
                                    </div>
                                )}
                            </div>
                        ) : !details ? (
                            <div className="admin-loading">Fetching Restaurant Data...</div>
                        ) : (
                            <div className="admin-grid">
                                {/* Sidebar / Controls */}
                                <div className="admin-sidebar">
                                    <div className="admin-card crowd-control">
                                        <h2 className="admin-card-title">Crowd & Capacity</h2>

                                        <div className="control-group">
                                            <label>Current Status</label>
                                            <div className="status-selector">
                                                {['Low', 'Medium', 'High', 'Full House'].map(level => (
                                                    <button
                                                        key={level}
                                                        className={`status-chip ${details.crowdLevel === level ? 'active' : ''}`}
                                                        onClick={() => handleCrowdUpdate('crowdLevel', level)}
                                                    >
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="control-group">
                                            <label>People Count ({details.peopleCount})</label>
                                            <div className="count-stepper">
                                                <button onClick={() => handleCrowdUpdate('peopleCount', Math.max(0, details.peopleCount - 5))}>-5</button>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={details.capacity}
                                                    value={details.peopleCount}
                                                    onChange={(e) => handleCrowdUpdate('peopleCount', parseInt(e.target.value))}
                                                />
                                                <button onClick={() => handleCrowdUpdate('peopleCount', Math.min(details.capacity, details.peopleCount + 5))}>+5</button>
                                            </div>
                                        </div>

                                        <div className="control-group">
                                            <label>Auto-Refresh (10s)</label>
                                            <button
                                                className={`toggle-btn ${autoRefresh ? 'on' : 'off'}`}
                                                onClick={() => setAutoRefresh(!autoRefresh)}
                                            >
                                                {autoRefresh ? 'Enabled' : 'Disabled'}
                                            </button>
                                        </div>

                                        <div className="live-preview-box">
                                            <p className="preview-label">Student View Preview</p>
                                            <div className="preview-indicator" style={{
                                                backgroundColor: details.crowdLevel === 'Low' ? '#4CAF50' :
                                                    details.crowdLevel === 'Medium' ? '#FFEB3B' :
                                                        details.crowdLevel === 'High' ? '#FF9800' : '#F44336'
                                            }}></div>
                                            <span className="preview-text">{details.crowdLevel}</span>
                                        </div>

                                        <button className="btn-push-update" onClick={() => toast.success('Updates pushed to all student views!')}>
                                            🚀 UPDATE STUDENT VIEW
                                        </button>
                                    </div>

                                    <div className="admin-card stock-alerts">
                                        <h2 className="admin-card-title">Stock Alerts</h2>
                                        <div className="alert-list">
                                            {details.menu.filter(item => item.count < 5).map(item => (
                                                <div key={item._id} className="stock-alert-item req-action">
                                                    <span className="alert-name">{item.name}</span>
                                                    <span className="alert-qty">{item.count} left</span>
                                                    <button onClick={() => handleRestock(item._id)}>+10</button>
                                                </div>
                                            ))}
                                            {details.menu.filter(item => item.count < 5).length === 0 && (
                                                <p className="no-alerts">✅ All items well stocked</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="admin-content">
                                    <div className="content-tabs">
                                        <button className={`main-tab ${mainTab === 'menu' ? 'active' : ''}`} onClick={() => setMainTab('menu')}>
                                            🍔 Menu Editor
                                        </button>
                                        <button className={`main-tab ${mainTab === 'orders' ? 'active' : ''}`} onClick={() => setMainTab('orders')}>
                                            📋 Live Orders {orders.filter(o => o.status !== 'Delivered').length > 0 && <span className="order-count-badge">{orders.filter(o => o.status !== 'Delivered').length}</span>}
                                        </button>
                                        <button className={`main-tab ${mainTab === 'feedbacks' ? 'active' : ''}`} onClick={() => setMainTab('feedbacks')}>
                                            💬 Feedbacks
                                        </button>
                                    </div>

                                    {mainTab === 'menu' && (
                                        <div className="admin-card menu-editor">
                                            <div className="editor-header">
                                                <h2 className="admin-card-title">Menu Editor</h2>
                                                <div className="category-filter">
                                                    {['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'].map(cat => (
                                                        <button
                                                            key={cat}
                                                            className={`cat-tab ${activeTab === cat ? 'active' : ''}`}
                                                            onClick={() => setActiveTab(cat)}
                                                        >
                                                            {cat}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="table-wrapper">
                                                <table className="admin-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Food Item</th>
                                                            <th>Price</th>
                                                            <th>Stock</th>
                                                            <th>Status</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {details.menu.filter(item => item.category === activeTab).map(item => (
                                                            <tr key={item._id}>
                                                                <td>
                                                                    <div className="item-edit-stack">
                                                                        <strong>{item.name}</strong>
                                                                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{item.desc}</p>
                                                                    </div>
                                                                </td>
                                                                <td>₹{item.price}</td>
                                                                <td>
                                                                    <div className="qty-edit">
                                                                        <button onClick={() => handleMenuItemUpdate(item._id, { count: Math.max(0, item.count - 1) })}>-</button>
                                                                        <span>{item.count}</span>
                                                                        <button onClick={() => handleMenuItemUpdate(item._id, { count: item.count + 1 })}>+</button>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className={`toggle-status ${item.status === 'Available' ? 'on' : 'off'}`}
                                                                        onClick={() => handleMenuItemUpdate(item._id, { status: item.status === 'Available' ? 'Sold Out' : 'Available' })}
                                                                    >
                                                                        {item.status}
                                                                    </button>
                                                                </td>
                                                                <td>
                                                                    <button className="btn-save-item" onClick={() => toast.success('Feature coming soon!')}>⚙️</button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {mainTab === 'orders' && (
                                        <div className="admin-card order-management">
                                            <h2 className="admin-card-title">Live Order Queue</h2>
                                            <div className="table-wrapper">
                                                <table className="admin-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Order ID</th>
                                                            <th>Items</th>
                                                            <th>Total</th>
                                                            <th>Status</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orders.filter(o => o.status !== 'Delivered').map(order => (
                                                            <tr key={order._id}>
                                                                <td><strong>#{order.orderId}</strong></td>
                                                                <td>{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</td>
                                                                <td>₹{order.total}</td>
                                                                <td><span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span></td>
                                                                <td>
                                                                    <div className="order-actions">
                                                                        {order.status === 'Placed' && <button className="btn-status accept" onClick={() => handleUpdateOrderStatus(order._id, 'Confirmed')}>Confirm</button>}
                                                                        {order.status === 'Confirmed' && <button className="btn-status prepare" onClick={() => handleUpdateOrderStatus(order._id, 'Preparing')}>Cook</button>}
                                                                        {order.status === 'Preparing' && <button className="btn-status out" onClick={() => handleUpdateOrderStatus(order._id, 'Out for Delivery')}>Dispatch</button>}
                                                                        {order.status === 'Out for Delivery' && <button className="btn-status deliver" onClick={() => handleUpdateOrderStatus(order._id, 'Delivered')}>Complete</button>}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {mainTab === 'feedbacks' && (
                                        <div className="admin-card feedbacks-section">
                                            <div className="section-header">
                                                <h2 className="admin-card-title">Customer Feedbacks 🌟</h2>
                                                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>What students are saying</p>
                                            </div>

                                            {loadingFeedback ? (
                                                <p>Loading feedbacks...</p>
                                            ) : feedbacks.length === 0 ? (
                                                <div className="empty-state">No feedbacks received yet.</div>
                                            ) : (
                                                <div className="feedback-grid">
                                                    {feedbacks.map(fb => (
                                                        <div key={fb._id} className="feedback-card">
                                                            <div className="feedback-card-header">
                                                                <span className="fb-user">{fb.userName}</span>
                                                                <span className="fb-category">{fb.category || 'Opinion'}</span>
                                                            </div>
                                                            <div className="fb-rating">
                                                                {'⭐'.repeat(fb.rating)}
                                                            </div>
                                                            <p className="fb-message">"{fb.message}"</p>
                                                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '10px', display: 'block' }}>
                                                                {new Date(fb.createdAt).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </main>
                </>
            )}
        </div>
    );
}
