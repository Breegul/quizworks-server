const Token = require('../../models/token');

describe('Token model', () => {

  test('constructor is a function', () => {
    expect(typeof Token).toBe('function');
  });
  describe('createToken', () => {
    test('is a function', () => {
      expect(typeof Token.prototype.createToken).toBe('function');
    });
  });

  describe('getTokenByTokenHash', () => {
    test('is a function', () => {
      expect(typeof Token.prototype.getTokenByTokenHash).toBe('function');
    });
  });

  describe('deleteTokenByTokenHash', () => {
    test('is a function', () => {
      expect(typeof Token.prototype.deleteTokenByTokenHash).toBe('function');
    });
  });
});
