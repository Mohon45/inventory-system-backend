const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  try {
    const data = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // Replace request data with parsed data (which strips unvalidated fields if schema is strictly defined)
    Object.assign(req, data);
    return next();
  } catch (error) {
    if (error.name === 'ZodError') {
      const errorMessage = error.errors.map((err) => err.message).join(', ');
      return next(new ApiError(400, errorMessage));
    }
    return next(error);
  }
};

module.exports = validate;
