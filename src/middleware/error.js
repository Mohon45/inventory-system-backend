const { Prisma } = require('@prisma/client');
const ApiError = require('../utils/ApiError');

const PRISMA_ERROR_MAP = {
  P2002: { statusCode: 409, message: 'A record with this value already exists' },
  P2025: { statusCode: 404, message: 'Record not found' },
};

const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = 500;
    let message = error.message || 'Internal server error';

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const mapped = PRISMA_ERROR_MAP[error.code];
      if (mapped) {
        statusCode = mapped.statusCode;
        message = mapped.message;
      } else {
        statusCode = 400;
        message = 'Database request error';
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      statusCode = 400;
      message = 'Invalid request data';
    }

    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = 500;
    message = 'Internal server error';
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorConverter, errorHandler };
