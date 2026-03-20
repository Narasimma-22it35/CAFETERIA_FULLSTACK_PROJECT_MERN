const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// POST or PUT requests will need identifying info.
// Since we might not have a full auth middleware set up yet for all routes, 
// the frontend will pass 'email' or 'userId' to identify the user for now.

// @route  POST /api/users/preferences
// @desc   Get user preferences
router.post('/preferences', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user.preferences || {
            emailNotifications: true,
            pushNotifications: true,
            darkMode: false
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route  PUT /api/users/preferences
// @desc   Update user preferences
router.put('/preferences', async (req, res) => {
    try {
        const { email, preferences } = req.body;
        if (!email || !preferences) return res.status(400).json({ message: 'Missing data' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.preferences = { ...user.preferences, ...preferences };
        await user.save();

        res.json({ message: 'Preferences updated', preferences: user.preferences });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route  PUT /api/users/password
// @desc   Update user password
router.put('/password', async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        if (!email || !currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
