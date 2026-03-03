import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const statuses = [
        { id: 'Placed', label: 'Order Placed', icon: '✅' },
        { id: 'Confirmed', label: 'Restaurant Confirmed', icon: '🔄' },
        { id: 'Preparing', label: 'Preparing Food', icon: '👨‍🍳' },
        { id: 'Out for Delivery', label: 'Out for Delivery', icon: '🛵' },
        { id: 'Delivered', label: 'Delivered', icon: '🚀' }
    ];

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/orders?studentId=${JSON.parse(localStorage.getItem('user')).id}`);
                const currentOrder = data.find(o => o._id === orderId);
                if (currentOrder) {
                    setOrder(currentOrder);
                }
            } catch (err) {
                console.error("Fetch order error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
        const interval = setInterval(fetchOrder, 5000); // Poll for status updates
        return () => clearInterval(interval);
    }, [orderId]);

    if (loading) return <div className="admin-loading">Initializing Tracker...</div>;
    if (!order) return <div className="admin-loading">Order Not Found</div>;

    const currentStatusIndex = statuses.findIndex(s => s.id === order.status);

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

            <main className="dashboard-main tracking-page">
                <div className="tracking-card">
                    <div className="tracking-header">
                        <div>
                            <h1>Track Order #{order.orderId}</h1>
                            <p>Arriving in 15-20 mins</p>
                        </div>
                        <div className="status-badge-tracking">{order.status}</div>
                    </div>

                    <div className="tracking-stepper">
                        {statuses.map((s, i) => (
                            <div key={s.id} className={`step ${i <= currentStatusIndex ? 'active' : ''}`}>
                                <div className="step-icon">{s.icon}</div>
                                <div className="step-label">{s.label}</div>
                                {i < statuses.length - 1 && <div className="step-line"></div>}
                            </div>
                        ))}
                    </div>

                    <div className="simulated-map">
                        <div className="map-overlay">
                            <div className="marker-restaurant">🏨</div>
                            <motion.div
                                className="marker-delivery"
                                animate={{
                                    x: currentStatusIndex * 80,
                                    y: i => Math.sin(currentStatusIndex + i) * 10
                                }}
                            >
                                🛵
                            </motion.div>
                            <div className="marker-student">📍</div>
                        </div>
                        <p className="map-caption">Delivery partner is on the way!</p>
                    </div>

                    <div className="order-details-bottom">
                        <h3>Order Details</h3>
                        {order.items.map((item, i) => (
                            <div key={i} className="track-item">
                                <span>{item.quantity}x {item.name}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                        <div className="track-total">
                            <span>Total Paid</span>
                            <span>₹{order.total}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                        <button className="back-home-btn" onClick={() => navigate('/dashboard')} style={{ flex: 1 }}>
                            Back to Home
                        </button>
                        <button
                            className="view-invoice-btn"
                            onClick={() => navigate(`/invoice/${order._id}`)}
                            style={{ flex: 1, background: '#bb86fc', color: '#000', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
                        >
                            📑 View Invoice
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderTracking;
