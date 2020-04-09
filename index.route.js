const express = require('express');
const transactionserviceRoutes = require('./server/transactions/transactions.route');

const router = express.Router();

router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount payments routes at /payments
router.use('/transactionservice', transactionserviceRoutes);

module.exports = router;
