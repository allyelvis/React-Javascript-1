const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('./config/config');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Sample user data (replace with actual user management logic)
const users = [];

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Something broke!');
};

// Register a new user
app.post('/auth/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new Error('Username, email, and password are required');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, username, email, password: hashedPassword };
    users.push(newUser);
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
});

// User login
app.post('/auth/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new Error('Username and password are required');
    }
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, config.secretKey, { expiresIn: '1d' }); // Token expires in 1 day
    res.status(200).send({ auth: true, token: token });
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
});

// Middleware to verify JWT token and set user context
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token.split(' ')[1], config.secretKey, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
};

// Protected route example
app.get('/userprofile', verifyToken, (req, res) => {
  // Retrieve user profile based on req.userId
  res.send(`User profile for user ID ${req.userId}`);
});

// Handle offline mode
app.get('/offline', (req, res) => {
  res.status(503).send('Service temporarily unavailable due to offline mode.');
});

// Error handling middleware registration
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
