const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const fixAdminRole = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const email = 'adm@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log(`Found user ${email} with role: ${user.role}`);
            user.role = 'admin';
            await user.save();
            console.log(`Successfully updated ${email} to Admin!`);
        } else {
            console.log(`User ${email} not found. Creating new admin...`);
            await User.create({
                name: 'Main Admin',
                email: email,
                password: 'admin123', // Default password since it wasn't found
                role: 'admin'
            });
            console.log(`Admin ${email} created.`);
        }

        process.exit();
    } catch (err) {
        console.error('Error fixing admin role:', err);
        process.exit(1);
    }
};

fixAdminRole();
