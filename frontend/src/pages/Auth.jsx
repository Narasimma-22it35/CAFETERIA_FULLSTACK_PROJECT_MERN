import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser, loginUser } from '../api/auth';

const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const roles = [
    { value: 'student', label: 'Student', icon: '🎓', desc: 'Browse & Order' },
    { value: 'admin', label: 'Admin', icon: '⚡', desc: 'Manage Outlet' },
];

export default function Auth() {
    const navigate = useNavigate();

    // Auto-redirect if already logged in
    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                if (user.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
        } catch (e) { }
    }, [navigate]);

    // Shared State & Loading
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    // Register State
    const [regForm, setRegForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [regErrors, setRegErrors] = useState({});
    const [showRegPw, setShowRegPw] = useState(false);

    // Login State
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [loginRole, setLoginRole] = useState('student');
    const [loginErrors, setLoginErrors] = useState({});
    const [showLoginPw, setShowLoginPw] = useState(false);

    // Handlers
    const handleRegChange = (e) => {
        setRegForm({ ...regForm, [e.target.name]: e.target.value });
        if (regErrors[e.target.name]) setRegErrors({ ...regErrors, [e.target.name]: '' });
    };

    const handleLoginChange = (e) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
        if (loginErrors[e.target.name]) setLoginErrors({ ...loginErrors, [e.target.name]: '' });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const errors = {};
        if (!regForm.name.trim()) errors.name = 'Name is required';
        if (!regForm.email.includes('@')) errors.email = 'Valid email required';
        if (regForm.password.length < 6) errors.password = 'Min 6 characters';
        if (regForm.password !== regForm.confirm) errors.confirm = 'Passwords do not match';

        if (Object.keys(errors).length) { setRegErrors(errors); return; }

        setLoading(true);
        try {
            await registerUser({ ...regForm, role: 'student' });
            toast.success('Account created! Please login now.');
            setRegForm({ name: '', email: '', password: '', confirm: '' });
            setIsLogin(true);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const errors = {};
        if (!loginForm.email.includes('@')) errors.email = 'Valid email required';
        if (!loginForm.password) errors.password = 'Password required';

        if (Object.keys(errors).length) { setLoginErrors(errors); return; }

        setLoading(true);
        try {
            const { data } = await loginUser({ ...loginForm, role: loginRole });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success(`Welcome back, ${data.user.name} !`);

            if (data.user.role === 'admin') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-bg"></div>

            <motion.div
                className="auth-container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`auth-tab ${!isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Register
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {isLogin ? (
                        <motion.div
                            key="login"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="auth-form-content"
                        >
                            <motion.h2 variants={itemVariants} className="auth-title">Welcome Back</motion.h2>
                            <motion.p variants={itemVariants} className="auth-subtitle">Select your role and continue to your campus tray.</motion.p>

                            <motion.div variants={itemVariants} className="role-cards">
                                {roles.map((r) => (
                                    <div
                                        key={r.value}
                                        className={`role-card ${loginRole === r.value ? 'active' : ''}`}
                                        onClick={() => setLoginRole(r.value)}
                                    >
                                        <span className="role-card-icon">{r.icon}</span>
                                        <span className="role-card-label">{r.label}</span>
                                        <span className="role-card-desc">{r.desc}</span>
                                    </div>
                                ))}
                            </motion.div>

                            <motion.form variants={itemVariants} onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <div className="input-container">
                                        <input name="email" type="email" className="form-input" placeholder="name@example.com" value={loginForm.email} onChange={handleLoginChange} required />
                                    </div>
                                    {loginErrors.email && <p className="form-error">{loginErrors.email}</p>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Security Key</label>
                                    <div className="input-container">
                                        <input name="password" type={showLoginPw ? 'text' : 'password'} className="form-input" placeholder="••••••••" value={loginForm.password} onChange={handleLoginChange} required />
                                        <button type="button" className="password-toggle" onClick={() => setShowLoginPw(!showLoginPw)}>{showLoginPw ? '🙈' : '👁️'}</button>
                                    </div>
                                    {loginErrors.password && <p className="form-error">{loginErrors.password}</p>}
                                </div>

                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Entering...' : 'Log In'}
                                </button>
                            </motion.form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="register"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="auth-form-content"
                        >
                            <motion.h2 variants={itemVariants} className="auth-title">Join Campus</motion.h2>
                            <motion.p variants={itemVariants} className="auth-subtitle">Create an account to start ordering your favorite meals.</motion.p>

                            <motion.form variants={itemVariants} onSubmit={handleRegister}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <div className="input-container">
                                        <input name="name" type="text" className="form-input" placeholder="Alex J." value={regForm.name} onChange={handleRegChange} required />
                                    </div>
                                    {regErrors.name && <p className="form-error">{regErrors.name}</p>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <div className="input-container">
                                        <input name="email" type="email" className="form-input" placeholder="alex@university.edu" value={regForm.email} onChange={handleRegChange} required />
                                    </div>
                                    {regErrors.email && <p className="form-error">{regErrors.email}</p>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Create Password</label>
                                    <div className="input-container">
                                        <input name="password" type={showRegPw ? 'text' : 'password'} className="form-input" placeholder="Min 6 characters" value={regForm.password} onChange={handleRegChange} required />
                                        <button type="button" className="password-toggle" onClick={() => setShowRegPw(!showRegPw)}>{showRegPw ? '🙈' : '👁️'}</button>
                                    </div>
                                    {regErrors.password && <p className="form-error">{regErrors.password}</p>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Confirm Key</label>
                                    <div className="input-container">
                                        <input name="confirm" type="password" className="form-input" placeholder="Repeat password" value={regForm.confirm} onChange={handleRegChange} required />
                                    </div>
                                    {regErrors.confirm && <p className="form-error">{regErrors.confirm}</p>}
                                </div>

                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Creating...' : 'Register'}
                                </button>
                            </motion.form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
