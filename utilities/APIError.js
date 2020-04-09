const httpStatus = require('http-status');

/**
 * @extends Error
 */
class ExtendableError extends Error {
  constructor(message, status, isPublic) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    Error.captureStackTrace(this, this.constructor.name);
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false) {
    super(message, status, isPublic);
  }
}


/**
 * Class representing an Invalidation error.
 * @extends ExtendableError
 */
class InvalidationError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} messageArray - Error message Array.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   * @param {string} name - If this api error has some name associated.
   */
  constructor(messageArray, status = httpStatus.BAD_REQUEST, isPublic = true, name = CONSTANTS.ERROR_TYPES.INVALID_INPUT) {
    super(messageArray, status, isPublic, name);
  }
}

/**
 * Class representing an UnAuthorization error.
 * @extends ExtendableError
 */
class UnauthorizedAPIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message Array.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   * @param {string} name - If this api error has some name associated.
   */
  constructor(message = CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED_USER, status = httpStatus.UNAUTHORIZED, isPublic = true, name = CONSTANTS.ERROR_TYPES.UNAUTHORIZED_USER) {
    super(message, status, isPublic, name);
  }
}

/**
 * Class representing an UnAuthorization error.
 * @extends ExtendableError
 */
class ForbiddenError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message Array.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   * @param {string} name - If this api error has some name associated.
   */
  constructor(message = CONSTANTS.ERROR_MESSAGES.FORBIDDEN_RESOURCE, status = httpStatus.FORBIDDEN, isPublic = true, name = CONSTANTS.ERROR_TYPES.FORBIDDEN_RESOURCE) {
    super(message, status, isPublic, name);
  }
}

/**
 * Class representing an UnAuthorization error.
 * @extends ExtendableError
 */
class UnauthenticatedAPIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message Array.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   * @param {string} name - If this api error has some name associated.
   */
  constructor(message=CONSTANTS.ERROR_MESSAGES.UNAUTHENTICATED_USER, status = httpStatus.UNAUTHORIZED, isPublic = true, name = CONSTANTS.ERROR_TYPES.UNAUTHENTICATED_USER) {
    super(message, status, isPublic, name);
  }
}


/**
 * Class representing an UnAuthorization error.
 * @extends ExtendableError
 */
class NotFoundError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message Array.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   * @param {string} name - If this api error has some name associated.
   */
  constructor(message, status = httpStatus.NOT_FOUND, isPublic = true, name = CONSTANTS.ERROR_TYPES.API_NOT_FOUND) {
    super(message, status, isPublic, name);
  }
}

class RateLimitError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message Array.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   * @param {string} name - If this api error has some name associated.
   */
  constructor(message=CONSTANTS.ERROR_MESSAGES.RATE_LIMIT, status = httpStatus.TOO_MANY_REQUESTS, isPublic = true, name = CONSTANTS.ERROR_TYPES.RATE_LIMIT) {
    super(message, status, isPublic, name);
  }
}


module.exports = { APIError, InvalidationError, UnauthorizedAPIError, NotFoundError, UnauthenticatedAPIError, RateLimitError, ForbiddenError };
