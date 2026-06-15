/**
 * Generic Joi validation middleware factory.
 * Pass a Joi schema, and it returns an Express middleware
 * that validates req.body against that schema.
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    // Replace body with the parsed/cleaned data
    req.body = value;
    next();
  };
};

/**
 * Validates req.params against a Joi schema.
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    req.params = value;
    next();
  };
};

export { validateBody, validateParams };
