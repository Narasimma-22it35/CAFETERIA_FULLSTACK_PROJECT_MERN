const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

try {
    const User = require('./models/User');
    console.log('--- Model Import Check ---');
    console.log('User variable type:', typeof User);
    console.log('User model name:', User.modelName);

    // Test creation without server
    async function test() {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        try {
            const u = new User({ name: 'Test', email: `test${Date.now()}@test.com`, password: 'pw' });
            await u.validate();
            console.log('Validation passed');
            // Do NOT save, just validate
        } catch (e) {
            console.error('Validation failed:', e);
        }
        await mongoose.connection.close();
    }
    test();
} catch (error) {
    console.error('Import failed:', error);
}
