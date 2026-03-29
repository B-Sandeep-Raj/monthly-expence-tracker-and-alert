/**
 * Error Handling Utilities
 * Custom error class for consistent error responses
 */

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode

    Error.captureStackTrace(this, this.constructor)
  }
}

// Specific error types for common scenarios
class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400)
    this.errors = errors
  }
}

class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404)
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 401)
  }
}

class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409)
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ConflictError
}
