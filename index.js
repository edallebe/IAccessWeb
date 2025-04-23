const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const usersRoutes = require('./backend/routes/usersroutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', usersRoutes);

// Serve static files from frontend directory
app.use(express.static('frontend'));

// Base route
app.get('/', (req, res) => {
  res.send('API is running. Use /api/user endpoints to interact with the user API.');
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export app for serverless functions
module.exports = app;