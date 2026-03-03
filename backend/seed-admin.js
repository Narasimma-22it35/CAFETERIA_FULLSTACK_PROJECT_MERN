const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding admin...');

        const adminEmail = 'admin@gmail.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists. Updating password...');
            existingAdmin.password = 'admin123';
            await existingAdmin.save();
        } else {
            console.log('Creating new admin user...');
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: 'admin123',
                role: 'admin'
            });
        }

        console.log('Admin user seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding admin:', err);
        process.exit(1);
    }
};

seedAdmin();
