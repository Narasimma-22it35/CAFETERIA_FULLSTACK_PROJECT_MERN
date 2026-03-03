const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

const fixRole = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'adminn@gmail.com';
        const user = await User.findOne({ email });
        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`User ${email} is now an ADMIN!`);
        } else {
            console.log(`User ${email} not found.`);
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixRole();
