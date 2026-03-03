const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./models/Restaurant');

dotenv.config();

const restaurants = [
    {
        name: "Dell",
        cuisine: "North Indian",
        rating: 4.2,
        crowdLevel: "Low",
        peopleCount: 24,
        capacity: 100,
        menu: [
            // BREAKFAST
            { name: "Poha", desc: "Flattened rice tempered with mustard seeds, turmeric, onion, and fresh coriander.", price: "₹40", count: 20, category: "BREAKFAST", icon: "🍚", badge: "Popular" },
            { name: "Aloo Paratha", desc: "Crispy whole wheat flatbread stuffed with spiced mashed potato, served with curd.", price: "₹60", count: 15, category: "BREAKFAST", icon: "🫓", badge: "Bestseller" },
            { name: "Upma", desc: "Savory semolina cooked with vegetables and curry leaves.", price: "₹35", count: 18, category: "BREAKFAST", icon: "🥣" },
            { name: "Masala Chai & Biscuits", desc: "Classic spiced Indian tea with ginger, cardamom, with crispy biscuits.", price: "₹20", count: 30, category: "BREAKFAST", icon: "☕" },
            // LUNCH
            { name: "Dal Tadka", desc: "Yellow lentils tempered with ghee, cumin, garlic and red chili.", price: "₹80", count: 12, category: "LUNCH", icon: "🥣", badge: "Popular" },
            { name: "Butter Chicken", desc: "Tender chicken in a rich, creamy tomato masala gravy. Served with naan.", price: "₹150", count: 8, category: "LUNCH", icon: "🍗", badge: "Bestseller" },
            { name: "Paneer Butter Masala", desc: "Soft cottage cheese cubes in luscious, aromatic tomato-cream sauce.", price: "₹130", count: 10, category: "LUNCH", icon: "🧀", badge: "Chef's Special" },
            { name: "Chole Bhature", desc: "Spiced chickpea curry served with deep-fried fluffy bread.", price: "₹90", count: 7, category: "LUNCH", icon: "🍛" },
            { name: "Veg Biryani", desc: "Fragrant basmati rice layered with spiced mixed vegetables.", price: "₹110", count: 9, category: "LUNCH", icon: "🍚" },
            // SNACKS
            { name: "Samosa", desc: "Crispy pastry filled with spiced potato and peas, served with chutney.", price: "₹20", count: 25, category: "SNACKS", icon: "🔺", badge: "Popular" },
            { name: "Pakora", desc: "Assorted vegetables dipped in spiced chickpea batter and deep fried.", price: "₹50", count: 20, category: "SNACKS", icon: "🍮" },
            { name: "Pani Puri", desc: "Crispy hollow puris filled with spiced tangy water and chickpeas.", price: "₹40", count: 15, category: "SNACKS", icon: "🫙" },
            { name: "Bread Pakora", desc: "Aloo-stuffed bread slices dipped in besan batter and fried golden.", price: "₹30", count: 18, category: "SNACKS", icon: "🥪" },
            // DINNER
            { name: "Chicken Biryani", desc: "Aromatic slow-cooked basmati rice with marinated chicken and saffron.", price: "₹180", count: 8, category: "DINNER", icon: "🍲", badge: "Bestseller" },
            { name: "Mutton Rogan Josh", desc: "Tender mutton slow-cooked in Kashmiri spices with whole aromatics.", price: "₹220", count: 5, category: "DINNER", icon: "🫕", badge: "Chef's Special" },
            { name: "Palak Paneer", desc: "Smooth spinach gravy with soft paneer cubes and homemade cream.", price: "₹140", count: 7, category: "DINNER", icon: "🥬" },
            { name: "Mixed Veg Curry", desc: "Seasonal vegetables in a rich onion-tomato masala base.", price: "₹100", count: 10, category: "DINNER", icon: "🍛" },
            { name: "Garlic Naan", desc: "Soft leavened flatbread with butter and roasted garlic, straight from tandoor.", price: "₹40", count: 20, category: "DINNER", icon: "🫓" }
        ]
    },
    {
        name: "Hot and Cold",
        cuisine: "South Indian",
        rating: 4.5,
        crowdLevel: "Medium",
        peopleCount: 42,
        capacity: 100,
        menu: [
            // BREAKFAST
            { name: "Masala Dosa", desc: "Crispy fermented rice crepe filled with spiced potato masala, served with sambar and chutney.", price: "₹70", count: 20, category: "BREAKFAST", icon: "🥐", badge: "Bestseller" },
            { name: "Idli Sambar", desc: "Soft steamed rice cakes served with hot dal sambar and coconut chutney.", price: "₹50", count: 25, category: "BREAKFAST", icon: "🍥", badge: "Popular" },
            { name: "Medu Vada", desc: "Crispy golden lentil donuts served with sambar and chutney.", price: "₹45", count: 18, category: "BREAKFAST", icon: "🍩" },
            { name: "Rava Upma", desc: "Semolina cooked with vegetables, mustard, curry leaves and groundnuts.", price: "₹40", count: 15, category: "BREAKFAST", icon: "🥣" },
            // LUNCH
            { name: "Curd Rice", desc: "Cooling tempered yogurt rice with mustard, curry leaves and green chili.", price: "₹55", count: 12, category: "LUNCH", icon: "🍚", badge: "Popular" },
            { name: "Sambar Rice", desc: "Steamed rice mixed with tangy lentil vegetable sambar and ghee.", price: "₹65", count: 10, category: "LUNCH", icon: "🥣" },
            { name: "Rasam Rice", desc: "Thin peppery tomato rasam poured over fluffy white rice with papad.", price: "₹55", count: 8, category: "LUNCH", icon: "🍲" },
            { name: "Chicken Chettinad", desc: "Fiery Chettinad spiced chicken curry with freshly ground masala.", price: "₹160", count: 6, category: "LUNCH", icon: "🍗", badge: "Chef's Special" },
            { name: "Kerala Fish Curry", desc: "Tangy coconut milk fish curry cooked with raw mango and kodampuli.", price: "₹150", count: 8, category: "LUNCH", icon: "🐟", badge: "Popular" },
            // SNACKS
            { name: "Murukku", desc: "Crunchy spiral-shaped snack made from rice flour and lentil flour.", price: "₹25", count: 30, category: "SNACKS", icon: "🌀" },
            { name: "Sundal", desc: "Spiced boiled chickpeas tempered with coconut, mustard and curry leaves.", price: "₹30", count: 20, category: "SNACKS", icon: "🫘" },
            { name: "Banana Chips", desc: "Thin sliced raw banana chips fried to perfection in coconut oil.", price: "₹35", count: 25, category: "SNACKS", icon: "🍌" },
            { name: "Mysore Bonda", desc: "Soft fluffy urad dal fritters, lightly spiced and fried golden.", price: "₹40", count: 15, category: "SNACKS", icon: "🟤" },
            // DINNER
            { name: "Prawn Biryani", desc: "Fragrant basmati rice layered with juicy spiced prawns and caramelized onions.", price: "₹200", count: 7, category: "DINNER", icon: "🦐", badge: "Bestseller" },
            { name: "Appam with Stew", desc: "Lacy soft Kerala appam served with coconut milk vegetable stew.", price: "₹90", count: 10, category: "DINNER", icon: "🥞", badge: "Chef's Special" },
            { name: "Pesarattu", desc: "Green moong dal crepe served with ginger chutney and upma.", price: "₹70", count: 12, category: "DINNER", icon: "🫓" },
            { name: "Pongal", desc: "Comforting rice and lentil porridge tempered with pepper and ghee.", price: "₹60", count: 15, category: "DINNER", icon: "🍚" }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        await Restaurant.deleteMany({});
        console.log('Cleared existing restaurants.');

        await Restaurant.insertMany(restaurants);
        console.log('Successfully seeded initial restaurants!');

        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
