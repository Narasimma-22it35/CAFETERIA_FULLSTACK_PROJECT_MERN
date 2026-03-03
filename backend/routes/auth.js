const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Import model properly
const User = require('../models/User');

// Generate JWT
const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '7d',
    });
};

// @route  POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        console.log('Registering user...');
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            role: role || 'student',
        });

        const token = generateToken(newUser._id, newUser.role);

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({
            message: 'Server error. Please try again.',
            error: error.message
        });
    }
});

// @route  POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (role && user.role !== role) {
            return res.status(403).json({
                message: `This account is not registered as ${role}.`,
            });
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

module.exports = router;
