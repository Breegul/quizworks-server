const Token = require("../models/token");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

async function authenticateUser(req, res, next) {
  try {
      const { token } = req.headers;
      if (!token) {
        return res.status(401).json({ message: 'Authentication failed. Token is missing.' });
      }
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const tokenObject = await Token.getTokenByTokenHash(tokenHash);
      if (tokenObject.isExpired()) {
        return res.status(401).json({ message: 'Authentication failed. Token has expired.' });
      }
      const user = await User.getUserById(tokenObject.userId);
      req.user = user;
      res.status(200).json(user);
      return next();        
  } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Authentication failed.' });
  }
}

function authenticateToken(req, res, next) {
  // Get the authorization header from the request
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    // If there's no token, return a 401 Unauthorized response
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the token and extract the user ID from it
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id };
    return next();
  } catch (err) {
    // If the token is invalid, return a 403 Forbidden response
    return res.status(403).json({ error: 'Forbidden' });
  }
}

module.exports = { 
  authenticateToken,
  authenticateUser
 };
