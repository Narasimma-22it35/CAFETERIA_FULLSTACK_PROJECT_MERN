const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

async function testStudentFlow() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        console.log('Navigating to Auth page...');
        await driver.get('http://localhost:5173/auth');

        // Wait until page loads
        await driver.wait(until.elementLocated(By.css('.auth-container')), 5000);

        // Click on the Student Role Card (Assuming the first card is usually Student, or search by text)
        console.log('Selecting Student role...');
        const roleCards = await driver.findElements(By.className('role-card'));
        for (let card of roleCards) {
            const text = await card.getText();
            if (text.includes('Student')) {
                await card.click();
                break;
            }
        }

        console.log('Entering credentials...');
        const emailInput = await driver.findElement(By.css('input[type="email"]'));
        await emailInput.clear();
        await emailInput.sendKeys('test_student@example.com'); // We will use a fallback logic in case this fails

        const passwordInput = await driver.findElement(By.css('input[type="password"]'));
        await passwordInput.clear();
        await passwordInput.sendKeys('password123');

        console.log('Submitting login form...');
        await driver.findElement(By.css('button[type="submit"]')).click();

        console.log('Waiting for dashboard redirection...');
        // Student goes to /dashboard
        await driver.wait(until.urlContains('/dashboard'), 5000);
        console.log('Dashboard loaded successfully.');

        // Wait for food items to load
        await driver.wait(until.elementLocated(By.className('food-category')), 5000);

        console.log('✅ Student Flow Test Passed Successfully!');
    } catch (err) {
        console.error('❌ Student Flow Test Failed:', err.message);
    } finally {
        await driver.quit();
    }
}

testStudentFlow();
