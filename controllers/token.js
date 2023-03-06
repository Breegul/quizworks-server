const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

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
    next();
  } catch (err) {
    // If the token is invalid, return a 403 Forbidden response
    return res.status(403).json({ error: 'Forbidden' });
  }
}

module.exports = { authenticateToken };
