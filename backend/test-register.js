const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const testRegister = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const testUser = {
            name: 'Test User',
            email: 'test' + Date.now() + '@gmail.com',
            password: 'password123',
            role: 'student'
        };

        console.log('Attempting to create user:', testUser);
        const user = await User.create(testUser);
        console.log('User created successfully:', user);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Test Failed:', error);
        process.exit(1);
    }
};

testRegister();
