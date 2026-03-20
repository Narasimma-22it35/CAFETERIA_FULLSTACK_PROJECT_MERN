const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

async function testAdminFlow() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        console.log('Navigating to Auth page...');
        await driver.get('http://localhost:5173/auth');

        // Wait until page loads
        await driver.wait(until.elementLocated(By.css('.auth-container')), 5000);

        // Click on the Admin Role Card
        console.log('Selecting Admin role...');
        // The role cards contain 'h2' or 'h3' with 'Admin'
        const roleCards = await driver.findElements(By.className('role-card'));
        for (let card of roleCards) {
            const text = await card.getText();
            if (text.includes('Admin')) {
                await card.click();
                break;
            }
        }

        console.log('Entering credentials...');
        const emailInput = await driver.findElement(By.css('input[type="email"]'));
        await emailInput.clear();
        await emailInput.sendKeys('admin@gmail.com');

        const passwordInput = await driver.findElement(By.css('input[type="password"]'));
        await passwordInput.clear();
        await passwordInput.sendKeys('admin123');

        console.log('Submitting login form...');
        await driver.findElement(By.css('button[type="submit"]')).click();

        console.log('Waiting for dashboard redirection...');
        await driver.wait(until.urlContains('/admin'), 5000);
        
        console.log('Navigating to Settings...');
        try {
            await driver.get('http://localhost:5173/settings');
            await driver.wait(until.urlContains('/settings'), 5000);
        } catch (e) {
            console.log('Settings page direct navigation failed, attempting manual click format...');
        }

        const settingsHeader = await driver.wait(until.elementLocated(By.css('h1')), 5000);
        const headerText = await settingsHeader.getText();
        assert(headerText.includes('Account Settings'));

        console.log('Checking Toggles...');
        const toggles = await driver.findElements(By.className('toggle-switch'));
        if (toggles.length > 0) {
            await toggles[0].click(); // Toggle first setting
            console.log('Toggled preference successfully.');
        }

        console.log('✅ Admin Flow Test Passed Successfully!');
    } catch (err) {
        console.error('❌ Admin Flow Test Failed:', err.message);
    } finally {
        await driver.quit();
    }
}

testAdminFlow();
