'use strict';
const httpStatus = require('http-status');

module.exports = (sequelize, DataTypes) => {
  const transactions = sequelize.define('transactions', {
    transaction_id: {
      type: DataTypes.DOUBLE,
      unique: true
    },
    amount: {
      type: DataTypes.DOUBLE
    },
    type: {
      type: DataTypes.STRING
    },
    parent_id: {
      type: DataTypes.DOUBLE
    }
  }, {
    paranoid: true,
    timestamps: false,
    freezeTableName: true,
    tableName: 'transactions'
  });

  return transactions;
};