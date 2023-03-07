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
function startServer(done) {
  const app = server.listen(port, () => {
    if (!done) {
      console.log(`Server listening on port ${port}`);
    } else {
      done();
    }
  });
  return app;
}

// Call the startServer function if the module is not being imported
if (require.main === module) {
  startServer();
}
//startServer()

function closeServer(app, done) {
  app.close(() => {
    if (!done) {
      console.log('Server closed');
    } else {
      done();
    }
  });
}
// server.get('/stop', (req, res) => {
//   res.send('Stopping server...');
//   server.close();
// });

module.exports = {
  startServer,
  closeServer
};
// Export for testing purposes
// module.exports = server;