const express = require('express');
const router = express.Router();

router.post('/order', (req, res) => {
  const { tableNumber, items } = req.body;
  // Handle restaurant order logic
  res.send('Order received');
});

router.get('/menu', (req, res) => {
  // Retrieve restaurant menu logic
  res.send('Restaurant menu');
});

module.exports = router;
