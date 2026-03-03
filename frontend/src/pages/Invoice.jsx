import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Invoice = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const { data } = await axios.get(`http://localhost:5000/api/orders?studentId=${user.id || user._id}`);
                const currentOrder = data.find(o => o._id === orderId);
                if (currentOrder) {
                    setOrder(currentOrder);
                }
            } catch (err) {
                console.error("Fetch order error:", err);
                toast.error("Failed to load invoice");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="admin-loading">Generating Bill...</div>;
    if (!order) return <div className="admin-loading">Invoice Not Found</div>;

    return (
        <div className="invoice-container-wrapper">
            <header className="no-print dashboard-header">
                <div className="header-content">
                    <Link to="/dashboard" className="header-logo">
                        <span className="logo-icon">🍽️</span>
                        <span className="logo-text">CaféSphere</span>
                    </Link>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button className="print-btn" onClick={handlePrint}>🖨️ Print Invoice</button>
                        <button className="back-btn-invoice" onClick={() => navigate(-1)}>Back</button>
                    </div>
                </div>
            </header>

            <motion.div
                className="invoice-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="invoice-header">
                    <div className="brand-section">
                        <h1>INVOICE</h1>
                        <p className="order-num">#{order.orderId}</p>
                    </div>
                    <div className="receipt-badge">PAID</div>
                </div>

                <div className="invoice-details-grid">
                    <div className="detail-col">
                        <label>FROM</label>
                        <strong>{order.restaurantId?.name || "CaféSphere Partner"}</strong>
                        <p>University Cafeteria Campus</p>
                    </div>
                    <div className="detail-col">
                        <label>BILLED TO</label>
                        <strong>{JSON.parse(localStorage.getItem('user')).name}</strong>
                        <p>{order.deliveryAddress}</p>
                    </div>
                    <div className="detail-col">
                        <label>DATE</label>
                        <p>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>

                <div className="invoice-table-section">
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>DESCRIPTION</th>
                                <th>QTY</th>
                                <th>PRICE</th>
                                <th style={{ textAlign: 'right' }}>TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>₹{item.price}</td>
                                    <td style={{ textAlign: 'right' }}>₹{item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="invoice-footer">
                    <div className="invoice-notes">
                        <p>Thank you for dining with us! 🌟</p>
                        <span className="secure-tag">🔒 Payment Simulation Verified</span>
                    </div>
                    <div className="invoice-summary">
                        <div className="sum-row">
                            <span>Subtotal</span>
                            <span>₹{(order.total / 1.05).toFixed(2)}</span>
                        </div>
                        <div className="sum-row">
                            <span>GST (5%)</span>
                            <span>₹{(order.total - (order.total / 1.05)).toFixed(2)}</span>
                        </div>
                        <div className="sum-total">
                            <span>Total Amount</span>
                            <span>₹{order.total}</span>
                        </div>
                    </div>
                </div>

                <div className="qr-sim-section">
                    <div className="qr-placeholder">
                        <div className="qr-box">🏁</div>
                        <p>Scan to verify</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Invoice;
