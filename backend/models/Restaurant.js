const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: String, required: true },
    count: { type: Number, required: true },
    category: {
        type: String,
        enum: ['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'],
        required: true
    },
    status: { type: String, enum: ['Available', 'Sold Out'], default: 'Available' },
    badge: { type: String, enum: ['None', 'Popular', 'Chef\'s Special', 'Bestseller'], default: 'None' },
    icon: { type: String },
    image: { type: String }
});

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    cuisine: { type: String, required: true },
    rating: { type: Number, default: 0 },
    crowdLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Full House'],
        default: 'Low'
    },
    peopleCount: { type: Number, default: 0 },
    capacity: { type: Number, default: 100 },
    menu: [menuItemSchema],
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
