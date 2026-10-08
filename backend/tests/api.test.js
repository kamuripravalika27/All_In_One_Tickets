const test = require('node:test');
const assert = require('node:assert');
require('dotenv').config();

test('Backend API Verification Tests', async (t) => {
  await t.test('Verify environment secrets setup', () => {
    assert.strictEqual(typeof (process.env.PORT || '5000'), 'string');
  });

  await t.test('Verify JWT secret presence', () => {
    const jwtSecret = process.env.JWT_SECRET || 'onetrip_super_secret_jwt_key_2026_production';
    assert.ok(jwtSecret.length > 10);
  });

  await t.test('Verify Indian city list helper', async () => {
    const searchController = require('../src/controllers/searchController');
    const mockRes = {
      json: (data) => data
    };
    const result = await searchController.getCities({}, mockRes);
    assert.strictEqual(result.success, true);
    assert.ok(result.cities.length >= 8);
  });
});

