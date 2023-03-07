const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const tokenController = require('./controllers/token');
const userRoutes = require('./routes/user');
const quizRoutes = require('./routes/quiz');
const noteRoutes = require('./routes/note');

const server = express();
const port = process.env.PORT || 3000;

// Middleware
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
// Use Morgan middleware to log HTTP requests
server.use(morgan('tiny'));

// Define a route for the home page
server.get('/', (req, res) => {
    res.json({
        name: "Application",
        description: "GET / route homepage"
    })
});

// Routes
server.use('/users', userRoutes);
server.use('/quizzes', quizRoutes); // add later: tokenController.authenticateUser,
server.use('/notes', tokenController.authenticateUser, noteRoutes);

//Error handling middleware
server.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

//server.listen(port, () => console.log(`Server listening on port ${port}`));

function startServer() {
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer()

function closeServer() {
  server.close(() => {
    console.log('Server closed');
  });
}

module.exports = {
  startServer,
  closeServer
};

// server.get('/stop', (req, res) => {
//   res.send('Stopping server...');
//   server.close();
// });

// Export for testing purposes
// module.exports = server;