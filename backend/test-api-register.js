const axios = require('axios');

const testApiRegistration = async () => {
    try {
        const testUser = {
            name: 'API Test User',
            email: 'apitest' + Date.now() + '@gmail.com',
            password: 'password123',
            role: 'student'
        };

        console.log('Testing API POST to http://localhost:5000/api/auth/register');
        const response = await axios.post('http://localhost:5000/api/auth/register', testUser);

        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
    } catch (error) {
        console.error('API Test Failed!');
        if (error.response) {
            console.error('Response Error Data:', error.response.data);
            console.error('Response Error Status:', error.response.status);
        } else {
            console.error('Network Error / No Response:', error.message);
        }
    }
};

testApiRegistration();
