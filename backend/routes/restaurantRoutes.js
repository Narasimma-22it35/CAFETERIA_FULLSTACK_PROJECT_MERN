const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// @route   GET /api/restaurants
// @desc    Get all restaurants (for listing page)
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find().select('-menu');
        res.json(restaurants);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/restaurants/:id
// @desc    Get restaurant details (for details page and admin)
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        res.json(restaurant);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PATCH /api/restaurants/:id/crowd
// @desc    Update restaurant crowd level (Admin only)
router.patch('/:id/crowd', async (req, res) => {
    try {
        const { crowdLevel, peopleCount } = req.body;
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        if (crowdLevel) restaurant.crowdLevel = crowdLevel;
        if (peopleCount !== undefined) restaurant.peopleCount = peopleCount;
        restaurant.lastUpdated = Date.now();

        await restaurant.save();
        res.json(restaurant);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PATCH /api/restaurants/:id/menu/:itemId
// @desc    Update specific menu item (Admin only)
router.patch('/:id/menu/:itemId', async (req, res) => {
    try {
        const { name, desc, price, count, category, status, badge } = req.body;
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        const item = restaurant.menu.id(req.params.itemId);
        if (!item) return res.status(404).json({ message: 'Menu item not found' });

        if (name) item.name = name;
        if (desc) item.desc = desc;
        if (price) item.price = price;
        if (count !== undefined) item.count = count;
        if (category) item.category = category;
        if (status) item.status = status;
        if (badge) item.badge = badge;

        restaurant.lastUpdated = Date.now();
        await restaurant.save();
        res.json(restaurant);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/restaurants/:id/menu/bulk
// @desc    Bulk update availability (e.g. restock)
router.post('/:id/menu/bulk', async (req, res) => {
    try {
        const { itemIds, increment } = req.body;
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        restaurant.menu.forEach(item => {
            if (itemIds.includes(item._id.toString())) {
                item.count += (increment || 0);
            }
        });

        restaurant.lastUpdated = Date.now();
        await restaurant.save();
        res.json(restaurant);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
