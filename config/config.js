const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(4040),
  DB_USERNAME: Joi.string().required()
    .description('MySQL Username'),
  DB_PASSWORD: Joi.string().required()
    .description('MySQL Password'),
  DB_NAME: Joi.string().required()
    .description('MySQL Name'),
  DB_HOSTNAME: Joi.string().required()
    .description('MySQL Host'),
  DB_PORT: Joi.string().required()
    .description('MySQL Port')
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mysql: {
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_NAME,
    host: envVars.DB_HOSTNAME,
    port: envVars.DB_PORT,
    dialect: 'mysql'
  }
};

module.exports = config;
