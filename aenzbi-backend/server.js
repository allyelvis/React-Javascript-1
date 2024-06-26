const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const { Client } = require('pg');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const pdfkit = require('pdfkit');
const config = require('./config/config');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: '*', // Adjust based on your frontend domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Initialize databases
const mysqlConnection = mysql.createConnection(config.mysql);
mysqlConnection.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});

const pgClient = new Client(config.postgresql);
pgClient.connect(err => {
  if (err) throw err;
  console.log('PostgreSQL connected');
});

mongoose.connect(config.mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token.split(' ')[1], config.secretKey, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
};

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role');
const staffRoutes = require('./routes/staff');
const hotelRoutes = require('./routes/hotel');
const restaurantRoutes = require('./routes/restaurant');
const retailRoutes = require('./routes/retail');
const accountingRoutes = require('./routes/accounting');
const salesRoutes = require('./routes/sales');
const productRoutes = require('./routes/product');
const inventoryRoutes = require('./routes/inventory');
const reportRoutes = require('./routes/report');
const configRoutes = require('./routes/config');
const purchaseRoutes = require('./routes/purchase');
const outletsRoutes = require('./routes/outlets');
const kitchenRoutes = require('./routes/kitchen');
const waiterRoutes = require('./routes/waiter');
const customerRoutes = require('./routes/customer');
const tableRoutes = require('./routes/table');
const designerRoutes = require('./routes/designer');
const posRoutes = require('./routes/pos');
const kitchenOrderRoutes = require('./routes/kitchenOrder');
const kitchenOrderTransactionRoutes = require('./routes/kitchenOrderTransaction');
const salesTransactionRoutes = require('./routes/salesTransaction');
const supplierRoutes = require('./routes/supplier');
const systemIntegratorRoutes = require('./routes/systemIntegrator');
const propertyConfigRoutes = require('./routes/propertyConfig');
const paymentRoutes = require('./routes/payment');

// Use routes
app.use('/auth', authRoutes);
app.use('/user', verifyToken, userRoutes);
app.use('/role', verifyToken, roleRoutes);
app.use('/staff', verifyToken, staffRoutes);
app.use('/hotel', verifyToken, hotelRoutes);
app.use('/restaurant', verifyToken, restaurantRoutes);
app.use('/retail', verifyToken, retailRoutes);
app.use('/accounting', verifyToken, accountingRoutes);
app.use('/sales', verifyToken, salesRoutes);
app.use('/product', verifyToken, productRoutes);
app.use('/inventory', verifyToken, inventoryRoutes);
app.use('/report', verifyToken, reportRoutes);
app.use('/config', verifyToken, configRoutes);
app.use('/purchase', verifyToken, purchaseRoutes);
app.use('/outlets', verifyToken, outletsRoutes);
app.use('/kitchen', verifyToken, kitchenRoutes);
app.use('/waiter', verifyToken, waiterRoutes);
app.use('/customer', verifyToken, customerRoutes);
app.use('/table', verifyToken, tableRoutes);
app.use('/designer', verifyToken, designerRoutes);
app.use('/pos', verifyToken, posRoutes);
app.use('/kitchen-order', verifyToken, kitchenOrderRoutes);
app.use('/kitchen-order-transaction', verifyToken, kitchenOrderTransactionRoutes);
app.use('/sales-transaction', verifyToken, salesTransactionRoutes);
app.use('/supplier', verifyToken, supplierRoutes);
app.use('/system-integrator', verifyToken, systemIntegratorRoutes);
app.use('/property-config', verifyToken, propertyConfigRoutes);
app.use('/payment', verifyToken, paymentRoutes);

// Real-time fiscal transaction handling on external endpoint
app.post('/fiscal/transaction', async (req, res) => {
  try {
    const { transactionDetails } = req.body;
    // Example: Forward transaction details to an external endpoint
    const externalResponse = await axios.post('http://externalapi.com/fiscal/transaction', transactionDetails);
    res.send(externalResponse.data);
  } catch (error) {
    console.error('Error handling fiscal transaction:', error.message);
    res.status(500).send('Error handling fiscal transaction');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
