const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const testEmail = `test_${Date.now()}@example.com`;
        const newUser = await User.create({
            name: 'Test User',
            email: testEmail,
            password: 'password123',
            role: 'student'
        });

        console.log('✅ User created successfully:', newUser.email);

        const foundUser = await User.findOne({ email: testEmail });
        console.log('✅ User found in DB:', foundUser.email);

        await mongoose.connection.close();
        console.log('✅ Connection closed');
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

test();
