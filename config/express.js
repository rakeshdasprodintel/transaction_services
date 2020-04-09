const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const httpStatus = require('http-status');
const expressWinston = require('express-winston');
const expressValidation = require('express-validation');
const helmet = require('helmet');
const winstonInstance = require('./winston');
const routes = require('../index.route');
const config = require('./config');
const fileUpload = require('express-fileupload');
const { APIError, InvalidationError, UnauthorizedAPIError, UnauthenticatedAPIError ,NotFoundError } = require('../utilities/APIError');
const { sendErrResponse } = require('../utilities/jsonFormatter');
const Sentry = require('@sentry/node');

const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

if(config.env === 'production') {
  Sentry.init({
    dsn: config.sentry.sentryDsn,
    environment: config.sentry.environment,
    debug: config.sentry.debug
  });
  app.use(Sentry.Handlers.requestHandler());
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
app.use(fileUpload());
// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable detailed API logging in dev env
if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
}

// mount all routes on /api path
app.use('/', routes);

app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});

if(config.env === 'production') {
  app.use(Sentry.Handlers.errorHandler());
}

if (config.env !== 'development') {
  app.use (function (req, res, next) {
      if (req.secure)
        return next();
      else
        return res.redirect('https://' + req.headers.host + req.url);
  });
}

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    let validationArray = [];
    for (let field in err.errors) {
      if(err.errors.hasOwnProperty(field)) {
        let validationObj = {};
        validationObj["messages"] = err.errors[field]["messages"];
        validationObj["types"] = err.errors[field]["types"];
        validationObj["field"] = err.errors[field]["field"];
        validationArray.push(validationObj);
      }
    }
    const error = new InvalidationError(validationArray);
    // const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    // const error = new APIError(unifiedErrorMessage, err.status, true, 'ValidationError');
    return next(error);
  }
  else if (err.name === 'ValidationError') {
    let validationArray = [];
    for (let field in err.errors) {
      if(err.errors.hasOwnProperty(field)) {
        let validationObj = {};
        validationObj["messages"] = [err.errors[field]["message"]];
        validationObj["types"] = [err.errors[field]["kind"]];
        validationObj["field"] = err.errors[field]["path"];
        validationArray.push(validationObj);
      }
    }
    const error = new InvalidationError(validationArray);
    return next(error);
  }
  else if(err instanceof UnauthorizedError) {
    const apiError = new UnauthenticatedAPIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  else if (!(err.hasOwnProperty("__type__") && err.__type__ === CONSTANTS.ERROR_TYPES.ERROR_INTERNAL_TYPE)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new NotFoundError('API not found');
  return next(err);
});

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }));
}

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {
  if(config.env === 'production') {
    Sentry.captureException(err);
  }
  res.status(err.status).json(sendErrResponse({
    name: err.name,
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {},
    id: res.sentry
  }))
});

module.exports = app;
