const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
  // Retrieve user profile logic
  res.send('User profile');
});

module.exports = router;
