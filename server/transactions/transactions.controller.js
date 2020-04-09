const to = require('await-to-js').default;
const transactionsService = require('./transactions.service');

const getTransaction = async (req, res) => {
  let [err, transaction] = await to(transactionsService.getTransactionById(req));
  if(err) {
    return res.json(sendErrResponse(err));
  } else {
    return res.json(transaction);
  }
};

const createTransaction = async (req, res, next) => {
  let [err, transaction] = await to(transactionsService.getTransactionById(req));
  if(err) {
    return res.json(sendErrResponse(err));
  } else {
    if(transaction){
      let [err, updateTransaction] = await to(transactionsService.updateTransaction(req));
      if(err){
        return res.json(sendErrResponse(err));
      }else{
        return res.json({"status" : "ok"});
      }
    }else{
      let [err, createTransaction] = await to(transactionsService.createTransaction(req));
      if(err){
        return res.json(sendErrResponse(err));
      }else{
        return res.json({"status" : "ok"});
      }
    }
  }
};

const getTransactions = async (req, res, next) => {
  let [err, transactions] = await to(transactionsService.getTransactions(req));
  if(err) {
    return res.json(sendErrResponse(err));
  } else {
    let results = [];
    for(let t in transactions)
      results.push(transactions[t].transaction_id);
    return res.json(results);
  }
};

const getSumTransaction = async (req, res, next) => {
  let sum = 0;
  let [err, transaction] = await to(transactionsService.getTransactionById(req));
  if(err){
    return res.json(sendErrResponse(err));
  }else{
    if(transaction){
      sum += transaction.amount;
      let [err, childTransactions] = await to(transactionsService.getChildTransactions(req));
      if(err) {
        return res.json(sendErrResponse(err));
      } else {
        for(let c in childTransactions){
          sum += childTransactions[c].amount;
        }
        return res.json({"sum" : sum});
      }
    }
  }
};

module.exports = {getTransaction, createTransaction, getTransactions, getSumTransaction } ;