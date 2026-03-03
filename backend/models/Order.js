const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
        },
        items: [
            {
                name: String,
                price: Number,
                quantity: Number,
                icon: String,
            },
        ],
        total: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
            default: 'Placed',
        },
        paymentMethod: {
            type: String,
            enum: ['Credit/Debit Card', 'UPI', 'Cash on Delivery', 'Wallet', 'Campus Card'],
            required: true,
        },
        deliveryAddress: {
            type: String,
            required: true,
        },
        orderId: {
            type: String,
            unique: true,
            default: () => 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
