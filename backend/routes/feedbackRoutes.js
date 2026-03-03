const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// @route  POST /api/feedback
// @desc   Submit feedback
router.post('/', async (req, res) => {
    try {
        const { userId, userName, rating, category, message, userRole } = req.body;

        if (userRole !== 'student') {
            return res.status(403).json({ message: 'Only students can submit feedback.' });
        }

        const newFeedback = new Feedback({
            user: userId,
            userName,
            rating,
            category,
            message
        });

        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Feedback Submission Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route  GET /api/feedback
// @desc   Get all feedback (Admin only)
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        console.error('Fetch Feedback Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
