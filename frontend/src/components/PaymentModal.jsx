import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess, amount, restaurantName }) => {
    const [step, setStep] = useState('methods'); // 'methods', 'processing', 'success'

    const handlePay = () => {
        setStep('processing');
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onPaymentSuccess();
                onClose();
            }, 1500);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="payment-modal-overlay">
            <motion.div
                className="payment-modal"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
            >
                <div className="payment-header">
                    <div>
                        <h4 style={{ margin: 0 }}>{restaurantName}</h4>
                        <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.6 }}>Payment for your tray</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>₹{amount}</span>
                    </div>
                </div>

                <div className="payment-body">
                    {step === 'methods' && (
                        <div className="payment-methods-simulation">
                            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '15px' }}>CHOOSE PAYMENT METHOD</p>
                            <div className="sim-method" onClick={handlePay} style={{ padding: '15px', border: '1px solid #339aff', background: '#f0f7ff', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', marginBottom: '10px' }}>
                                <span style={{ fontSize: '1.5rem' }}>📱</span>
                                <div>
                                    <strong style={{ display: 'block' }}>UPI (Google Pay, PhonePe)</strong>
                                    <span style={{ fontSize: '0.7rem', color: '#339aff' }}>Safe & Instant</span>
                                </div>
                            </div>
                            <div className="sim-method" onClick={handlePay} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', opacity: 0.6 }}>
                                <span style={{ fontSize: '1.5rem' }}>💳</span>
                                <div>
                                    <strong style={{ display: 'block' }}>Cards (Visa, Master)</strong>
                                    <span style={{ fontSize: '0.7rem' }}>Powered by Stripe Sim</span>
                                </div>
                            </div>
                            <button className="pay-btn" onClick={handlePay}>PAY ₹{amount}</button>
                            <p style={{ textAlign: 'center', fontSize: '0.6rem', color: '#999', marginTop: '15px' }}>🔒 Verified by CaféSphere Secure Gate</p>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                style={{ fontSize: '3rem', marginBottom: '20px' }}
                            >
                                ⏳
                            </motion.div>
                            <h3>Processing Payment...</h3>
                            <p style={{ color: '#666' }}>Please do not refresh or close the window</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{ fontSize: '4rem', color: '#4CAF50', marginBottom: '20px' }}
                            >
                                ✅
                            </motion.div>
                            <h3 style={{ color: '#4CAF50' }}>Payment Successful!</h3>
                            <p style={{ color: '#666' }}>Your order is being placed...</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentModal;
