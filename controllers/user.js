const userModel = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userModel.getUserById(id);
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
  
  async function getUserByUsername(req, res) {
    try {
      const { username } = req.params;
      const user = await userModel.getUserByUsername(username);
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
  
  async function createUser(req, res) {
    try {
      const { username, password, role } = req.body;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = await userModel.createUser(username, hashedPassword, role);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
  
  async function updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, password, role } = req.body;
      const user = await userModel.updateUser(id, username, password, role);
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
  
  async function deleteUser(req, res) {
    try {
      const { id } = req.params;
      await userModel.deleteUser(id);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
  
  async function loginUser(req, res) {
    try {
      const { username, password } = req.body;
      const user = await userModel.verifyUser(username, password);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }

  module.exports = {
    getUserById,
    getUserByUsername,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
  };
