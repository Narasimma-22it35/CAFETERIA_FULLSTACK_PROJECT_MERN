const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');

// @route  POST /api/orders
// @desc   Create a new order
router.post('/', async (req, res) => {
    try {
        const { studentId, restaurantId, items, total, paymentMethod, deliveryAddress } = req.body;
        console.log('Incoming Order Data:', { studentId, restaurantId, itemsCount: items?.length, total, paymentMethod });

        if (!studentId || !restaurantId || !items || !total) {
            console.warn('Missing fields in order creation');
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Handle wallet deductions if applicable
        if (paymentMethod === 'Wallet' || paymentMethod === 'Campus Card') {
            const user = await User.findById(studentId);
            if (!user) {
                console.error(`User with ID ${studentId} not found`);
                return res.status(404).json({ message: 'User not found' });
            }

            const balanceKey = paymentMethod === 'Wallet' ? 'walletBalance' : 'campusCardBalance';
            console.log(`Current ${balanceKey}:`, user[balanceKey]);

            if (user[balanceKey] < total) {
                return res.status(400).json({ message: 'Insufficient balance' });
            }

            user[balanceKey] -= total;
            await user.save();
        }

        const newOrder = await Order.create({
            student: studentId,
            restaurant: restaurantId,
            items,
            total,
            paymentMethod,
            deliveryAddress
        });

        console.log('Order Successfully Created:', newOrder.orderId);
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Server error creating order', error: error.message });
    }
});

// @route  GET /api/orders
// @desc   Get all orders (Admin) or user orders (Student)
router.get('/', async (req, res) => {
    try {
        const { studentId } = req.query;
        let query = {};
        if (studentId) query.student = studentId;

        const orders = await Order.find(query)
            .populate('student', 'name email')
            .populate('restaurant', 'name')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// @route  PATCH /api/orders/:id/status
// @desc   Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status' });
    }
});

module.exports = router;
