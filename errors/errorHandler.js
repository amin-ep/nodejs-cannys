import HTTPError from './httpError.js';

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const handleJWTError = () => {
  return new HTTPError('Invalid token', 401);
};

const handleCastError = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new HTTPError(message, 404);
};

const handleJwtExpieredError = () => {
  return new HTTPError('The token expiered! Please login again', 401);
};

export default function (err, req, res, next) {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  const appMode = process.env.NODE_ENV;

  if (appMode === 'development') {
    sendDevError(err, res);
  } else if (appMode === 'production') {
    if (err.name === 'JsonWebTokenError') err = handleJWTError();
    if (err.name === 'CastError') err = handleCastError(err);
    if (err.name === 'TokenExpiredError') err = handleJwtExpieredError();
    sendProdError(err, res);
  }
}
