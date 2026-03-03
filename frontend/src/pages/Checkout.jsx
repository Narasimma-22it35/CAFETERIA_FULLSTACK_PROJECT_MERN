import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import PaymentModal from '../components/PaymentModal';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart, restaurant, total } = location.state || { cart: [], restaurant: null, total: 0 };

    const [user, setUser] = useState(null);
    const [address, setAddress] = useState('');
    const [hostel, setHostel] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Wallet');
    const [processing, setProcessing] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            navigate('/auth');
            return;
        }
        setUser(userData);
        if (!cart || cart.length === 0) {
            navigate('/dashboard');
        }
    }, [cart, navigate]);

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        if (!hostel || !address) {
            toast.error('Please provide delivery details');
            return;
        }
        setShowPayment(true);
    };

    const completeOrder = async () => {
        setProcessing(true);
        try {
            const parsePrice = (p) => {
                if (typeof p === 'number') return p;
                if (typeof p === 'string') return parseInt(p.replace(/[^0-9]/g, '')) || 0;
                return 0;
            };

            const orderData = {
                studentId: user.id || user._id,
                restaurantId: restaurant._id,
                items: cart.map(item => ({
                    name: item.name,
                    price: parsePrice(item.price),
                    quantity: item.quantity,
                    icon: item.icon
                })),
                total: parseFloat(total),
                paymentMethod,
                deliveryAddress: `${hostel}, ${address}`,
                status: 'Payment Success'
            };

            const { data } = await axios.post('http://localhost:5000/api/orders', orderData);

            toast.success('Order Placed Successfully! 🎉');
            navigate('/order-tracking/' + data._id);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to connect to server';
            console.error('Checkout Error:', err);
            toast.error(`Order Failed: ${errorMsg}`);
        } finally {
            setProcessing(false);
            setShowPayment(false);
        }
    };

    if (!user) return null;

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

            <main className="dashboard-main checkout-page">
                <div className="checkout-grid">
                    <div className="checkout-left">
                        <motion.form
                            className="checkout-card"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onSubmit={handlePlaceOrder}
                        >
                            <h2>Delivery Details 📍</h2>
                            <div className="form-group">
                                <label>Hostel / Department</label>
                                <select value={hostel} onChange={(e) => setHostel(e.target.value)} required>
                                    <option value="">Select Hostel</option>
                                    <option value="Hostel A">Hostel A</option>
                                    <option value="Hostel B">Hostel B</option>
                                    <option value="Hostel C">Hostel C</option>
                                    <option value="Department Block">Academic Department</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Specific Room / Table Number</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Room 302, Ground Floor Table 5"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <h2 style={{ marginTop: '40px' }}>Payment Method 💳</h2>
                            <div className="payment-options">
                                {[
                                    { id: 'Wallet', label: 'Wallet Balance', sub: `₹${user.walletBalance || 500}`, icon: '💰' },
                                    { id: 'UPI', label: 'UPI / QR Code', sub: 'Simulated QR', icon: '📱' },
                                    { id: 'Campus Card', label: 'Campus Card', sub: `₹${user.campusCardBalance || 200}`, icon: '💳' },
                                    { id: 'Cash on Delivery', label: 'Cash on Delivery', sub: 'Pay on arrival', icon: '💵' }
                                ].map(opt => (
                                    <div
                                        key={opt.id}
                                        className={`payment-opt ${paymentMethod === opt.id ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod(opt.id)}
                                    >
                                        <span className="opt-icon">{opt.icon}</span>
                                        <div className="opt-text">
                                            <strong>{opt.label}</strong>
                                            <span>{opt.sub}</span>
                                        </div>
                                        <div className="opt-radio"></div>
                                    </div>
                                ))}
                            </div>

                            <button className="place-order-btn" disabled={processing}>
                                {processing ? 'Processing...' : `Pay ₹${total} & Place Order`}
                            </button>
                        </motion.form>
                    </div>

                    <div className="checkout-right">
                        <div className="checkout-card order-summary">
                            <h2>Order Summary</h2>
                            <div className="summary-res">
                                <span className="res-emoji">🏢</span>
                                <div>
                                    <h3>{restaurant?.name} 🍽️</h3>
                                    <p>{restaurant?.cuisine} • Freshly Prepared</p>
                                </div>
                            </div>

                            <div className="summary-items">
                                {cart.map((item, i) => (
                                    <div key={i} className="summary-item">
                                        <span className="item-emoji">{item.icon || '🍱'}</span>
                                        <span className="item-qty">{item.quantity}x</span>
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-price">{item.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-totals">
                                <div className="total-row">
                                    <span>Subtotal</span>
                                    <span>₹{(total / 1.05).toFixed(2)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Taxes & Charges</span>
                                    <span>₹{(total - (total / 1.05)).toFixed(2)}</span>
                                </div>
                                <div className="total-final">
                                    <span>To Pay</span>
                                    <span>₹{total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <PaymentModal
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                onPaymentSuccess={completeOrder}
                amount={total}
                restaurantName={restaurant?.name}
            />
        </div>
    );
};

export default Checkout;
