const express = require('express');
const transactionsCtrl = require('./transactions.controller');
const router = express.Router();

/*   /transactionservice/transaction/:transactionId */
router.route('/transaction/:transactionId')
  .get(transactionsCtrl.getTransaction)        // Get transaction Details by ID
  .put(transactionsCtrl.createTransaction) // Update transaction

/*   /transactionservice/types/:typeName */
router.route('/types/:typeName')
  .get(transactionsCtrl.getTransactions)        // Get transaction id by types

/*   /transactionservice/sum/:transactionId */
router.route('/sum/:transactionId')
  .get(transactionsCtrl.getSumTransaction)        // Get sum by transaction ID

module.exports = router;