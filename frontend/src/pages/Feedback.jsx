import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Feedback = () => {
    const navigate = useNavigate();
    const [feedbackData, setFeedbackData] = useState({ rating: 5, category: 'Food Quality', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Attempt to get user data from localStorage
    let user = null;
    try {
        const raw = localStorage.getItem('user');
        if (raw) user = JSON.parse(raw);
    } catch (e) {
        console.error("Auth parsing failed");
    }

    // Role check: Only students can send feedback
    useState(() => {
        if (user && user.role !== 'student') {
            toast.error("Feedback is for students only. Admin panel handles reception.");
            navigate('/admin');
        }
    }, [user, navigate]);

    const emojis = ['😠', '😞', '😐', '🙂', '😍'];

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("You must be logged in to submit feedback.");
            navigate('/auth');
            return;
        }

        if (!feedbackData.message.trim()) {
            toast.error("Please share your thoughts before submitting.");
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/feedback', {
                userId: user.id || user._id,
                userName: user.name,
                userRole: user.role,
                ...feedbackData
            });
            toast.success('Thank you for your feedback! 🌟');
            navigate('/dashboard'); // Return to dashboard after success
        } catch (err) {
            toast.error('Failed to submit feedback');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="feedback-page-container">
            <div className="feedback-page-bg"></div>

            <motion.div
                className="feedback-page-content"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="feedback-header-actions">
                    <button className="back-link" onClick={() => navigate('/dashboard')}>
                        ← Back to Dashboard
                    </button>
                    <div className="feedback-brand">
                        <span className="logo-icon">🍽️</span>
                        <span>CaféSphere</span>
                    </div>
                </div>

                <div className="feedback-form-card">
                    <motion.div
                        className="feedback-form-header"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="feedback-title">We Value Your Opinion ✨</h1>
                        <p className="feedback-subtitle">Help us make your dining experience even more delicious!</p>
                    </motion.div>

                    <form onSubmit={handleFeedbackSubmit} className="feedback-form-main">
                        <motion.div
                            className="form-group-animated"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className="animated-label">How was your experience?</label>
                            <div className="emoji-rating-selector">
                                {emojis.map((emoji, index) => {
                                    const ratingValue = index + 1;
                                    return (
                                        <motion.button
                                            key={ratingValue}
                                            type="button"
                                            className={`emoji-btn ${feedbackData.rating === ratingValue ? 'selected' : ''}`}
                                            onClick={() => setFeedbackData({ ...feedbackData, rating: ratingValue })}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <span className="emoji-icon">{emoji}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                            <div className="rating-text">
                                {feedbackData.rating === 1 && "Terrible"}
                                {feedbackData.rating === 2 && "Poor"}
                                {feedbackData.rating === 3 && "Okay"}
                                {feedbackData.rating === 4 && "Good"}
                                {feedbackData.rating === 5 && "Excellent"}
                            </div>
                        </motion.div>

                        <motion.div
                            className="form-group-animated"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="animated-label">What aspect are you reviewing?</label>
                            <div className="custom-select-wrapper">
                                <select
                                    className="enhanced-select"
                                    value={feedbackData.category}
                                    onChange={(e) => setFeedbackData({ ...feedbackData, category: e.target.value })}
                                >
                                    <option value="Food Quality">🍔 Food Quality</option>
                                    <option value="Service">👨‍🍳 Service & Staff</option>
                                    <option value="App Experience">📱 App Experience</option>
                                    <option value="Cleanliness">✨ Cleanliness</option>
                                    <option value="Other">💡 Other Suggestion</option>
                                </select>
                            </div>
                        </motion.div>

                        <motion.div
                            className="form-group-animated"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label className="animated-label">Tell us more</label>
                            <textarea
                                className="enhanced-textarea"
                                placeholder="What did you love? What can we improve?"
                                value={feedbackData.message}
                                onChange={(e) => setFeedbackData({ ...feedbackData, message: e.target.value })}
                                rows="5"
                            />
                        </motion.div>

                        <motion.div
                            className="feedback-submit-wrapper"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <button
                                type="submit"
                                className={`enhanced-submit-btn ${isSubmitting ? 'loading' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Send Feedback 🚀'}
                            </button>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Feedback;
