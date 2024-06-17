const express = require('express');
const router = express.Router();

router.post('/add', (req, res) => {
  const { productDetails } = req.body;
  // Handle add product logic
  res.send('Product added');
});

router.get('/list', (req, res) => {
  // Retrieve product list logic
  res.send('List of products');
});

module.exports = router;
