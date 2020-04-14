const util = require('util');
const config = require('./config/config');
const app = require('./config/express');
const https = require('https');
const fs = require('fs');
const db = require('./database/models/index.js');
var cluster = require('cluster');
var debug = require('debug')('express-sequelize');

console.log('Server started with environment: ', config.env);

let certObj = {};

if (cluster.isMaster) {
  var cpuCount = config.env === 'production' ? require('os').cpus().length:1;
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
} else {
  console.log("Running Worker Processes");
  if (!module.parent) {
    if(config.env !== 'development'){
      https.createServer(certObj, app).listen(config.port, () => {
        console.info(`Server started on port ${config.port} (${config.env})`);
      });
    }else{
      app.listen(config.port, () => {
        console.info(`Server started on port ${config.port} (${config.env})`);
      });
    }
  }
}

// Listen for dying workers
cluster.on('exit', function (worker) {
  console.log('Worker %d died :(', worker.id);
  cluster.fork();
});

module.exports = app;

