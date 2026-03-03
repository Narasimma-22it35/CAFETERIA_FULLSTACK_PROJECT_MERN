const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./models/Restaurant');

dotenv.config();

const images = {
    pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop',
    burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
    dosa: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop',
    idli: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop', // Placeholder for idli
    biryani: 'https://images.unsplash.com/photo-1563379091339-03b17af4a4af?q=80&w=1000&auto=format&fit=crop',
    fries: 'https://images.unsplash.com/photo-1573016605511-583d73500d43?q=80&w=1000&auto=format&fit=crop'
};

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const restaurants = await Restaurant.find();

        for (let res of restaurants) {
            for (let item of res.menu) {
                const name = item.name.toLowerCase();
                if (name.includes('pizza')) item.image = images.pizza;
                else if (name.includes('burger')) item.image = images.burger;
                else if (name.includes('dosa')) item.image = images.dosa;
                else if (name.includes('idli')) item.image = images.idli;
                else if (name.includes('biryani')) item.image = images.biryani;
                else if (name.includes('fries') || name.includes('french')) item.image = images.fries;
                else item.image = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop'; // Default
            }
            await res.save();
            console.log(`Updated images for ${res.name}`);
        }

        console.log('All images updated successfully!');
        process.exit();
    } catch (err) {
        console.error('Error updating images:', err);
        process.exit(1);
    }
};

updateImages();
