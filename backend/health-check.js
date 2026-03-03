const axios = require('axios');

async function testApi() {
    try {
        console.log('Testing GET /api/restaurants...');
        const res = await axios.get('http://localhost:5000/api/restaurants');
        console.log('Status:', res.status);
        console.log('Data count:', res.data.length);
        if (res.data.length > 0) {
            console.log('First restaurant:', res.data[0].name);
        } else {
            console.warn('WARNING: No restaurants found in DB!');
        }
    } catch (err) {
        console.error('API Test Failed:', err.message);
    }
}

testApi();
