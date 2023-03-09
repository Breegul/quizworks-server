const User = require('../../models/user');
const { pool } = require('../../database/pool.js');
const bcrypt = require('bcrypt');

describe('User', () => {

  let user;

  beforeAll(async () => {
    user = new User();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('constructor', () => {
    test('constructor is a function', () => {
      expect(typeof User).toBe('function');
    });
  });

  describe('getUserById', () => {
    test('getUserById is a function', () => {
      expect(typeof User.prototype.getUserById).toBe('function');
    });
    test('should return a user object with the specified ID', async () => {
      // create a new user and retrieve their ID
      const username = 'testuser52';
      const password = 'testpass';
      const role = 'student';
      const { id } = await User.createUser(username, password, role);
      //console.log("id: ", id);
      // retrieve the user by ID
      const user = await new User().getUserById(id);
      // assert that the returned user object matches the expected values
      expect(user.id).toBe(id);
      expect(user.username).toBe(username);
      //expect(user.password).toBeDefined();
      expect(user.password).not.toBe(password); // should be hashed
      expect(user.role).toBe(role);
      // clean up by deleting the user
      await new User().deleteUser(user.id);
    });
    test('should throw an error if no user is found with the specified ID', async () => {
      // try to retrieve a non-existent user by ID
      const id = 'nonexistentid';
      // assert that an error is thrown
      await expect(new User().getUserById(id)).rejects.toThrow();
    });
  });

  describe('getUserByUsername', () => {
    test('getUserByUsername is a function', () => {
      expect(typeof User.getUserByUsername).toBe('function');
    });
    test('should return a user object with the specified username', async () => {
      // create a new user and retrieve their username
      const username = 'testuser80';
      const password = 'testpass';
      const role = 'student';
      await User.createUser(username, password, role);
      // retrieve the user by username
      const user = await User.getUserByUsername(username);
      // assert that the returned user object matches the expected values
      expect(user.username).toBe(username);
      expect(user.password).toBeDefined();
      expect(user.password).not.toBe(password); // should be hashed
      expect(user.role).toBe(role);
      // clean up by deleting the user
      //await User.deleteUser(user.id);
      await new User().deleteUser(user.id);
    });
    test('should throw an error if no user is found with the specified username', async () => {
      // try to retrieve a non-existent user by username
      const username = 'nonexistentuser';
      // assert that an error is thrown
      await expect(User.getUserByUsername(username)).rejects.toThrow();
    });
  });

  describe('createUser', () => {
    test('createUser is a function', () => {
      expect(typeof User.createUser).toBe('function');
    });
    test('should create a new user with the specified username, password, and role', async () => {
      // create a new user
      const username = 'testuser1235';
      const password = 'testpass';
      const role = 'student';
      const user = await User.createUser(username, password, role);
      // assert that the returned user object matches the expected values
      expect(user.username).toBe(username);
      expect(user.password).toBeDefined();
      expect(user.password).not.toBe(password); // should be hashed
      expect(user.role).toBe(role);
      // clean up by deleting the user
      await new User().deleteUser(user.id);
    });
    test('should throw an error if username is not provided', async () => {
      // try to create a new user without providing a username
      const username = undefined;
      const password = 'testpass';
      const role = 'student';
      // assert that an error is thrown
      await expect(User.createUser(username, password, role)).rejects.toThrow();
    });
    test('should throw an error if password is not provided', async () => {
      // try to create a new user without providing a password
      const username = 'testuser456';
      const password = undefined;
      const role = 'student';
      // assert that an error is thrown
      await expect(User.createUser(username, password, role)).rejects.toThrow();
    });
    test('should throw an error if role is not provided', async () => {
      // try to create a new user without providing a role
      const username = 'testuser789';
      const password = 'testpass';
      const role = undefined;
      // assert that an error is thrown
      await expect(User.createUser(username, password, role)).rejects.toThrow();
    });
  });

  describe('updateUser', () => {
    test('updateUser is a function', () => {
      expect(typeof User.prototype.updateUser).toBe('function');
    });
    test('should update a user with the specified ID', async () => {
      // create a new user and retrieve their ID
      const username = 'testuser23456';
      const password = 'testpass';
      const role = 'student';
      const { id } = await User.createUser(username, password, role);
      // update the user with new values
      const newUsername = 'updateduser';
      const newPassword = 'updatedpass';
      const newRole = 'teacher';
      const updatedUser = await new User().updateUser(id, newUsername, newPassword, newRole);
      // retrieve the user by ID to verify the update
      const user = await new User().getUserById(id);
      // assert that the returned user object matches the expected values
      expect(user.id).toBe(id);
      expect(user.username).toBe(newUsername);
      expect(user.password).toBeDefined();
      expect(user.password).not.toBe(newPassword); // should be hashed
      expect(user.role).toBe(newRole);
      // clean up by deleting the user
      await new User().deleteUser(user.id);
    });
    test('should throw an error if no user is found with the specified ID', async () => {
      // try to update a non-existent user by ID
      const id = 'nonexistentid';
      const username = 'updateduser';
      const password = 'updatedpass';
      const role = 'teacher';
      // assert that an error is thrown
      await expect(new User().updateUser(id, username, password, role)).rejects.toThrow();
    });
  });

  describe('deleteUser', () => {
    test('deleteUser is a function', () => {
      expect(typeof User.prototype.deleteUser).toBe('function');
    });
    test('should delete the user with the specified ID', async () => {
      // create a new user
      const username = 'testuser234511';
      const password = 'testpass';
      const role = 'student';
      const { id } = await User.createUser(username, password, role);
      // delete the user
      await new User().deleteUser(id);
      // try to retrieve the deleted user by ID
      await expect(new User().getUserById(id)).rejects.toThrow();
    });
    test('should throw an error if no user is found with the specified ID', async () => {
      // try to delete a non-existent user by ID
      const id = 'nonexistentid';
      // assert that an error is thrown
      await expect(new User().deleteUser(id)).rejects.toThrow();
    });
  });

  describe('verifyUser', () => {
    test('verifyUser is a function', () => {
      expect(typeof User.verifyUser).toBe('function');
    });
    test('should return user object if username and password match', async () => {
      // Arrange
      const username = 'testuser99u765';
      const password = 'testpass';
      const role = 'student';
      await User.createUser(username, password, role);
      // Act
      const verifiedUser = await User.verifyUser(username, password);
      // Assess
      expect(verifiedUser.username).toBe(username);
      expect(verifiedUser.role).toBe(role);
      // Clean up by deleting the user
      await new User().deleteUser(verifiedUser.id);
    });

    test('should throw an error if username is incorrect', async () => {
      // create a new user with a known username and password
      const username = 'testuser1044023re456';
      const password = 'testpass';
      const role = 'student';
      const { id } = await User.createUser(username, password, role);
      // attempt to verify the user's credentials with an incorrect username
      const incorrectUsername = 'wronguser';
      const incorrectPassword = password;
      // assert that an error is thrown
      await expect(User.verifyUser(incorrectUsername, incorrectPassword)).rejects.toThrow();
      // clean up by deleting the user
      //await User.deleteUser(verifiedUser.id);
      await new User().deleteUser(id);
    });
    test('should throw an error if password is incorrect', async () => {
      // create a new user with a known username and password
      const username = 'testuser1033176kn5423';
      const password = 'testpass';
      const role = 'student';
      const { id } = await User.createUser(username, password, role);
      // attempt to verify the user's credentials with an incorrect password
      const incorrectUsername = username;
      const incorrectPassword = 'wrongpass';
      // assert that an error is thrown
      await expect(User.verifyUser(incorrectUsername, incorrectPassword)).rejects.toThrow();
      // clean up by deleting the user
      //await User.deleteUser(verifiedUser.id);
      await new User().deleteUser(id);
    });
  });
});
