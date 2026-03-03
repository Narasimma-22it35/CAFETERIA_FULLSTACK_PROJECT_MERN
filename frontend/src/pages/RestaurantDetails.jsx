import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRestaurantDetails } from '../api/restaurants';

const RestaurantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [crowdCount, setCrowdCount] = useState(0);
    const [crowdLevel, setCrowdLevel] = useState('Low');
    const [lastUpdated, setLastUpdated] = useState('');

    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const getStatusColor = () => {
        if (crowdLevel === 'Low') return '#4CAF50';
        if (crowdLevel === 'Medium') return '#FFEB3B';
        if (crowdLevel === 'High') return '#FF9800';
        return '#F44336';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
    };

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            navigate('/auth');
            return;
        }
        setUser(userData);

        const fetchDetails = async () => {
            try {
                const { data } = await getRestaurantDetails(id);
                setRestaurant(data);
                setCrowdCount(data.peopleCount);
                setCrowdLevel(data.crowdLevel);
                setLastUpdated(new Date(data.lastUpdated).toLocaleTimeString());
            } catch (err) {
                console.error("Failed to fetch details");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();

        // Polling for crowd updates every 5 seconds for simulation
        const interval = setInterval(fetchDetails, 5000);
        return () => clearInterval(interval);
    }, [id]);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i._id === item._id);
            if (existing) {
                return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (itemId) => {
        setCart(prev => {
            const existing = prev.find(i => i._id === itemId);
            if (existing.quantity > 1) {
                return prev.map(i => i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
            }
            return prev.filter(i => i._id !== itemId);
        });
    };

    const cartTotal = cart.reduce((sum, item) => {
        const price = parseInt(item.price.replace(/[^0-9]/g, ''));
        return sum + (price * item.quantity);
    }, 0);

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

    if (loading || !user) return <div className="admin-loading">Loading Restaurant...</div>;
    if (!restaurant) return <div className="admin-loading">Restaurant NOT Found</div>;

    // Dynamically categorize the menu
    const menuData = {
        BREAKFAST: { title: "🍳 BREAKFAST MENU", color: "#FF9800", items: restaurant.menu.filter(i => i.category === 'BREAKFAST') },
        LUNCH: { title: "🍔 LUNCH MENU", color: "#4CAF50", items: restaurant.menu.filter(i => i.category === 'LUNCH') },
        SNACKS: { title: "🍟 SNACKS MENU", color: "#E91E63", items: restaurant.menu.filter(i => i.category === 'SNACKS') },
        DINNER: { title: "🍽️ DINNER MENU", color: "#2196F3", items: restaurant.menu.filter(i => i.category === 'DINNER') }
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <Link to="/dashboard" className="header-logo">
                        <span className="logo-icon">🍽️</span>
                        <span className="logo-text">CaféSphere</span>
                    </Link>
                    <nav className="header-nav">
                        <Link to="/dashboard" className="nav-link">Home</Link>
                        {user.role === 'admin' && <Link to="/admin" className="nav-link admin-glow">Admin Panel</Link>}
                        <Link to="/orders" className="nav-link">My Orders</Link>
                        <button onClick={handleLogout} className="nav-link btn-logout">Logout</button>
                    </nav>
                    <div className="header-profile" onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ cursor: 'pointer', position: 'relative' }}>
                        <div className="profile-info" style={{ marginRight: '10px' }}>
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
                                    style={{ top: '60px' }}
                                >
                                    <div className="dropdown-header">
                                        <span className="drop-name">{user.name}</span>
                                        <span className="drop-role">{user.role}</span>
                                    </div>
                                    <button className="dropdown-item" onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}>
                                        <span className="item-icon">👤</span> Profile
                                    </button>
                                    <button className="dropdown-item" onClick={() => { navigate('/orders'); setIsProfileOpen(false); }}>
                                        <span className="item-icon">📦</span> My Orders
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

            <main className="dashboard-main menu-dashboard">
                {/* Back Button and Info */}
                <div className="details-header-section">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>
                        ← Back to Restaurants
                    </button>
                    <h1>{restaurant.name}</h1>
                    <p className="res-meta">{restaurant.cuisine} • {restaurant.rating}★ Rating</p>
                </div>

                {/* Real-time Crowd Update Section */}
                <motion.div
                    className="crowd-banner-card"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="banner-left">
                        <div className="live-badge">
                            <span className="pulse"></span> LIVE CROWD
                        </div>
                        <div className="status-display">
                            <span className="status-indicator" style={{ backgroundColor: getStatusColor() }}></span>
                            <h2>{crowdLevel}</h2>
                        </div>
                        <p className="update-meta">Updated just now ({lastUpdated})</p>
                    </div>

                    <div className="banner-center">
                        <div className="capacity-label">Restaurant Capacity</div>
                        <div className="capacity-bar-wrapper">
                            <motion.div
                                className="capacity-bar-fill"
                                animate={{ width: `${crowdCount}%` }}
                                style={{ backgroundColor: getStatusColor() }}
                            />
                        </div>
                        <div className="capacity-ticks">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                        </div>
                    </div>

                    <div className="banner-right">
                        <div className="people-count">{crowdCount}</div>
                        <p>people currently inside</p>
                    </div>
                </motion.div>

                {/* Categorized Menu Section */}
                {Object.entries(menuData).map(([key, category]) => (
                    <section key={key} className="menu-category-section">
                        <div className="category-header" style={{ borderLeftColor: category.color }}>
                            <h2 style={{ color: category.color }}>{category.title}</h2>
                            <div className="header-line"></div>
                        </div>

                        <motion.div
                            className="menu-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {category.items.map((item) => {
                                const cartItem = cart.find(i => i._id === item._id);
                                return (
                                    <motion.div
                                        key={item._id}
                                        className={`menu-item-card ${item.status === 'Sold Out' ? 'item-sold-out' : ''}`}
                                        variants={itemVariants}
                                        whileHover={item.status === 'Available' ? { y: -5 } : {}}
                                    >
                                        <div className="item-image-wrapper">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="item-food-image" />
                                            ) : (
                                                <span className="item-emoji">{item.icon}</span>
                                            )}
                                            {item.badge && item.badge !== 'None' && <span className="item-badge">{item.badge}</span>}
                                            {item.count < 5 && item.count > 0 && <span className="stock-warning">Low Stock</span>}
                                            {item.status === 'Sold Out' && <span className="sold-out-tag">Sold Out</span>}
                                        </div>

                                        <div className="item-body">
                                            <div className="item-title-row">
                                                <h3>{item.name}</h3>
                                                <span className="item-price">{item.price}</span>
                                            </div>
                                            <p className="item-desc">{item.desc}</p>

                                            <div className="item-footer">
                                                <div className="stock-info">
                                                    <span className={`stock-dot ${item.count < 5 ? 'red' : 'green'}`}></span>
                                                    <span>{item.count} available</span>
                                                </div>
                                                {cartItem ? (
                                                    <div className="qty-selector-group">
                                                        <button className="qty-btn" onClick={() => removeFromCart(item._id)}>−</button>
                                                        <span className="qty-num">{cartItem.quantity}</span>
                                                        <button className="qty-btn" onClick={() => addToCart(item)} disabled={cartItem.quantity >= item.count}>+</button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="add-item-btn"
                                                        disabled={item.status === 'Sold Out' || item.count === 0}
                                                        onClick={() => addToCart(item)}
                                                    >
                                                        {item.status === 'Sold Out' ? 'Out of Stock' : 'Add to Tray +'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </section>
                ))}
            </main>

            {/* Floating Cart Sidebar */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            className="cart-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                        />
                        <motion.div
                            className="cart-sidebar"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <div className="cart-header">
                                <h2>Your Tray 🛒</h2>
                                <button className="close-cart" onClick={() => setIsCartOpen(false)}>×</button>
                            </div>

                            <div className="cart-items-list">
                                {cart.length === 0 ? (
                                    <div className="empty-cart-view">
                                        <div className="empty-icon">🍱</div>
                                        <p>Your tray is empty</p>
                                        <button className="start-ordering-btn" onClick={() => setIsCartOpen(false)}>Start Ordering</button>
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item._id} className="cart-item">
                                            <span className="cart-item-icon">{item.icon}</span>
                                            <div className="cart-item-info">
                                                <h4>{item.name}</h4>
                                                <p>{item.price}</p>
                                            </div>
                                            <div className="cart-qty-controls">
                                                <button onClick={() => removeFromCart(item._id)}>−</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => addToCart(item)} disabled={item.quantity >= item.count}>+</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="cart-footer">
                                    <div className="summary-row">
                                        <span>Subtotal</span>
                                        <span>₹{cartTotal}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Taxes & Charges</span>
                                        <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
                                    </div>
                                    <div className="summary-total">
                                        <span>Total</span>
                                        <span>₹{(cartTotal * 1.05).toFixed(2)}</span>
                                    </div>
                                    <button
                                        className="checkout-btn"
                                        onClick={() => navigate('/checkout', { state: { cart, restaurant, total: (cartTotal * 1.05).toFixed(2) } })}
                                    >
                                        Proceed to Checkout →
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <footer className="dashboard-footer">
                <p>© 2026 CaféSphere . Premium Student Dining Experience</p>
            </footer>
        </div>
    );
};

export default RestaurantDetails;
