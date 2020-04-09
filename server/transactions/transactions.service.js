const to = require('await-to-js').default;
const db = require('./../../database/models');
const transactions = db.transactions;
const _ = require('underscore');

function getTransactionById(req){
  let searchObj = {};
  searchObj['transaction_id'] = req.params.transactionId;
  return transactions.findOne({ "where": searchObj});
}

function createTransaction(req) {
  let transactionData = req.body;
  transactionData.transaction_id = req.params.transactionId;
  return transactions.create(transactionData);
};

function updateTransaction(req) {
  let transactionData = req.body;
  transactionData.transaction_id = req.params.transactionId;
  let options = {};
  options['transaction_id'] = req.params.transactionId;
  return transactions.update(transactionData,{ "where": options});
};

function getTransactions(req){
  let searchObj = {};
  searchObj['type'] = req.params.typeName;
  return transactions.findAll({ "where": searchObj});
}

async function getChildTransactions(req){
  let sumTransactionData = req.body;
  let query = "SELECT amount FROM transactions AS T1 INNER JOIN (SELECT transaction_id FROM transactions WHERE parent_id = "+req.params.transactionId+") AS T2 ON T2.transaction_id = T1.parent_id OR T1.parent_id = "+req.params.transactionId+" GROUP BY T1.transaction_id";
  let [err, transactionAmounts] = await to(db.sequelize.query(query , {raw: true, type: db.sequelize.QueryTypes.SELECT}));
  if(err){
    throw new Error(err);
  }else{
    return transactionAmounts;
  }
}

module.exports = {getTransactionById , createTransaction, getTransactions, updateTransaction, getChildTransactions};
