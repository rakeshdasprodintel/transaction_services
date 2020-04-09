'use strict';

const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const env       = process.env.NODE_ENV || 'development';
const db        = {};
const config    = require('../../config/config.js');
const basename  = path.basename(__filename);

const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
  dialect: config.mysql.dialect,
  host: config.mysql.host,
  port: config.mysql.port,
  timezone: '+05:30'
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database');
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
