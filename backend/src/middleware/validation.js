/**
 * Input validation middleware
 * Provides sanitization and validation for all inputs
 */

const xss = require('xss');
const Joi = require('joi');

/**
 * Sanitize string to prevent XSS attacks
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return xss(str, {
    whiteList: {}, // No HTML tags allowed
    stripIgnoredTag: true,
    stripLeadingAndTrailingWhitespace: true
  });
};

/**
 * Middleware to sanitize request body
 */
const sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]).trim();
      }
    });
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]).trim();
      }
    });
  }

  // Sanitize URL parameters
  if (req.params && typeof req.params === 'object') {
    Object.keys(req.params).forEach(key => {
      if (typeof req.params[key] === 'string') {
        req.params[key] = sanitizeString(req.params[key]).trim();
      }
    });
  }

  next();
};

/**
 * Validate using Joi schema
 */
const validateSchema = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body || {}, {
    stripUnknown: true,
    abortEarly: true
  });

  if (error) {
    return res.status(400).json({
      error: {
        status: 400,
        message: 'Validation failed',
        details: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message
        }))
      }
    });
  }

  req.validated = value;
  next();
};

module.exports = {
  sanitizeString,
  sanitizeInput,
  validateSchema
};
