const axios = require('axios');

async function verify() {
    try {
        console.log('--- Testing Registration ---');
        const regRes = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'API Verify',
            email: `api_${Date.now()}@test.com`,
            password: 'password123',
            role: 'student'
        });
        console.log('✅ Registration SUCCESS:', regRes.data.message);
        console.log('✅ User id:', regRes.data.user.id);

        console.log('\n--- Testing Login with same credentials ---');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: regRes.data.user.email,
            password: 'password123',
            role: 'student'
        });
        console.log('✅ Login SUCCESS:', loginRes.data.message);
    } catch (error) {
        console.error('❌ API Test Failed:', error.response?.data || error.message);
    }
}

verify();
