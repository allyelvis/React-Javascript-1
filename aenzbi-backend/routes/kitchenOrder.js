const express = require('express');
const router = express.Router();

router.post('/create', (req, res) => {
  const { orderId, items } = req.body;
  // Handle kitchen order creation logic
  res.send('Kitchen order created');
});

router.get('/list', (req, res) => {
  // Retrieve list of kitchen orders logic
  res.send('List of kitchen orders');
});

module.exports = router;
