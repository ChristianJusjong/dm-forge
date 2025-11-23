/**
 * Test Script for DM Forge Security Fixes
 * Run this in the browser console to verify fixes.
 */

async function runTests() {
    console.log('🧪 Starting DM Forge Security Tests...');
    let passed = 0;
    let failed = 0;

    function assert(condition, message) {
        if (condition) {
            console.log(`✅ PASS: ${message}`);
            passed++;
        } else {
            console.error(`❌ FAIL: ${message}`);
            failed++;
        }
    }

    // 1. Test Password Hashing & Salting
    console.log('\n--- Testing Authentication ---');
    const testUser = {
        username: 'testuser_' + Date.now(),
        email: 'test@example.com',
        password: 'password123'
    };

    // Signup
    if (window.signup) {
        const signupResult = await window.signup(testUser.username, testUser.email, testUser.password);
        assert(signupResult.success, 'Signup should succeed');

        // Verify storage
        const users = JSON.parse(localStorage.getItem('dm_codex_users') || '[]');
        const storedUser = users.find(u => u.username === testUser.username);
        assert(storedUser, 'User should be stored');
        if (storedUser) {
            assert(storedUser.salt, 'Stored user should have a salt');
            assert(storedUser.password !== testUser.password, 'Password should be hashed');
            assert(storedUser.password.length > 20, 'Hash should be substantial');
        }

        // Login
        const loginResult = await window.login(testUser.username, testUser.password);
        assert(loginResult.success, 'Login should succeed with correct password');
    } else {
        console.warn('⚠️ window.signup not available, skipping auth tests');
    }

    // 2. Test XSS Prevention
    console.log('\n--- Testing XSS Prevention ---');
    const maliciousName = '<script>alert("XSS")</script>';
    if (window.escapeHTML) {
        const escapedName = window.escapeHTML(maliciousName);
        assert(escapedName === '&lt;script&gt;alert("XSS")&lt;/script&gt;', 'escapeHTML should escape tags');
        assert(!escapedName.includes('<script>'), 'Escaped string should not contain script tags');
    } else {
        console.error('❌ FAIL: window.escapeHTML is not defined');
        failed++;
    }

    // Test Campaign Sanitization
    if (window.createCampaign && window.escapeHTML) {
        const campaign = window.createCampaign(maliciousName);
        assert(campaign.name === maliciousName, 'Campaign name stored as is (sanitization happens at display)');

        // Simulate display in dashboard (mocking the logic)
        const displayHTML = `<h2>${window.escapeHTML(campaign.name)}</h2>`;
        assert(!displayHTML.includes('<script>'), 'Campaign name should be escaped in HTML');
    }

    // 3. Test JSON Safety
    console.log('\n--- Testing JSON Safety ---');
    localStorage.setItem('corrupt_data', '{ "broken": json }'); // Invalid JSON
    if (window.safeJSONParse) {
        const safeParseResult = window.safeJSONParse(localStorage.getItem('corrupt_data'), 'fallback');
        assert(safeParseResult === 'fallback', 'safeJSONParse should return fallback for invalid JSON');
    } else {
        console.error('❌ FAIL: window.safeJSONParse is not defined');
        failed++;
    }

    // 4. Test Backup/Restore
    console.log('\n--- Testing Backup/Restore ---');
    if (window.createBackup && window.restoreBackup) {
        const backup = window.createBackup();
        assert(backup, 'Backup should return a string');
        if (backup) {
            assert(JSON.parse(backup).version, 'Backup should have version');

            const restoreResult = window.restoreBackup(backup);
            assert(restoreResult.success, 'Restore should succeed with valid backup');
        }
    } else {
        console.error('❌ FAIL: Backup/Restore functions not defined');
        failed++;
    }

    console.log(`\n🏁 Tests Completed: ${passed} Passed, ${failed} Failed`);
}

// Expose to window
window.runTests = runTests;
console.log('Test script loaded. Run window.runTests() to execute.');
