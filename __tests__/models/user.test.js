const User = require('../../models/user');

describe('User', () => {
  test('constructor is a function', () => {
    expect(typeof User).toBe('function');
  });

  test('getUserById is a function', () => {
    expect(typeof User.prototype.getUserById).toBe('function');
  });

  test('getUserByUsername is a function', () => {
    expect(typeof User.prototype.getUserByUsername).toBe('function');
  });

  test('createUser is a function', () => {
    expect(typeof User.prototype.createUser).toBe('function');
  });

  test('updateUser is a function', () => {
    expect(typeof User.prototype.updateUser).toBe('function');
  });

  test('deleteUser is a function', () => {
    expect(typeof User.prototype.deleteUser).toBe('function');
  });

  test('verifyUser is a function', () => {
    expect(typeof User.prototype.verifyUser).toBe('function');
  });
});
