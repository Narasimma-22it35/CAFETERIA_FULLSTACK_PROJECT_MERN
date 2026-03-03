import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            navigate('/auth');
            return;
        }
        setUser(userData);

        const fetchOrders = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/orders?studentId=${userData.id}`);
                setOrders(data);
            } catch (err) {
                console.error("Fetch orders error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    if (loading || !user) return <div className="admin-loading">Loading Your History...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <Link to="/dashboard" className="header-logo">
                        <span className="logo-icon">🍽️</span>
                        <span className="logo-text">CaféSphere</span>
                    </Link>
                    <nav className="header-nav">
                        <Link to="/dashboard" className="nav-link">Home</Link>
                        <Link to="/orders" className="nav-link active">My Orders</Link>
                    </nav>
                </div>
            </header>

            <main className="dashboard-main orders-page">
                <div className="orders-header-row">
                    <h1>Your Order Journey 🍱</h1>
                    <p>Relive your delicious moments at CaféSphere</p>
                </div>

                <div className="orders-list">
                    {orders.length === 0 ? (
                        <div className="empty-orders">
                            <div className="empty-icon">🍽️</div>
                            <h3>No orders yet?</h3>
                            <p>Treat yourself to something special today!</p>
                            <Link to="/dashboard" className="explore-btn">Start Ordering</Link>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <motion.div
                                key={order._id}
                                className="order-history-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="order-card-header">
                                    <div className="res-info">
                                        <h3>{order.restaurant?.name || 'Restaurant'}</h3>
                                        <span>Ordered on {new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className={`order-status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                        {order.status}
                                    </div>
                                </div>

                                <div className="order-card-body">
                                    <div className="order-items-summary">
                                        {order.items.map((item, i) => (
                                            <span key={i} className="history-item">
                                                <span className="h-qty">{item.quantity}x</span> {item.name}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="delivery-loc">📍 {order.deliveryAddress}</p>
                                </div>

                                <div className="order-card-footer">
                                    <div className="order-total-price">
                                        Total: <strong>₹{order.total}</strong>
                                    </div>
                                    <Link to={`/order-tracking/${order._id}`} className="view-tracking-btn">
                                        Re-track Order →
                                    </Link>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default Orders;
