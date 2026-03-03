const fs = require('fs');
const path = require('path');
const { transformSync } = require('@babel/core');

const pagesDir = 'd:/CAFETERIA_FULL_STACK/frontend/src/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    const filePath = path.join(pagesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    try {
        transformSync(content, {
            presets: ['@babel/preset-react'],
            filename: file
        });
        console.log(`PASSED: ${file}`);
    } catch (err) {
        console.error(`FAILED: ${file}`);
        console.error(err.message);
    }
});
