const seedDatabase = require('../../database/db-seeds');

describe('Database seeding', () => {
    test('seedDatabase should be a function', () => {
        expect(typeof seedDatabase).toBe('function');
    });
});
