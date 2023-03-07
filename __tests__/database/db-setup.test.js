const { setupDatabase } = require('../../database/db-setup');

describe('Database setup', () => {
    test('setupDatabase should be a function', () => {
        expect(typeof setupDatabase).toBe('function');
    });
});
