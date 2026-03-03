const bcrypt = require('bcryptjs');

async function test() {
    try {
        console.log('Bcrypt versions:', process.versions);
        console.log('Bcrypt type:', typeof bcrypt);
        console.log('genSalt type:', typeof bcrypt.genSalt);

        const salt = await bcrypt.genSalt(10);
        console.log('Salt generated:', salt);

        const hash = await bcrypt.hash('password123', salt);
        console.log('Hash generated:', hash);

        const isMatch = await bcrypt.compare('password123', hash);
        console.log('Comparison successful:', isMatch);
    } catch (error) {
        console.error('❌ Bcrypt test failed:', error);
    }
}

test();
