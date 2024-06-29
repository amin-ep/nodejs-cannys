import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import HTTPError from '../errors/httpError.js';

export const protect = catchAsync(async (req, res, next) => {
  // get token
  let token = '';
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token) {
    return next(new HTTPError("You're not ogged in. Please login first", 401));
  }
  // get user based on token and validate token
  // eslint-disable-next-line no-undef
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new HTTPError(`The user does not exists`, 404));
  }

  // check password changed recently or not
  const userHasChangedPassword = currentUser.passwordChangedAfter(decoded.iat);
  currentUser.passwordChangedAfter(decoded.iat);

  if (userHasChangedPassword) {
    return next(
      new HTTPError(
        'This user has changed hist password recently. Please login again',
        401,
      ),
    );
  }

  if (currentUser.verified === false) {
    return next(
      new HTTPError(
        'Your account does not verified yet. Please verify Your email',
        401,
      ),
    );
  }

  req.user = currentUser;
  next();
});

export const allowedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new HTTPError("You don't have premission to performe this action", 403),
      );
    }
    next();
  };
};

export const protectUserField = (req, res, next) => {
  if (req.body.user) {
    return next(
      new HTTPError('Cannot change the user field on this document!'),
    );
  }
  next();
};

export const setUserOnBody = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

export const checkDocsOwner = Model => {
  return async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (document.user != req.user.id) {
      if (req.user.role === 'admin') {
        return next();
      } else {
        return next(
          new HTTPError(
            "You don't have premission to performe this action!",
            403,
          ),
        );
      }
    }
  };
};

export const setFeedbackIdOnBody = (req, res, next) => {
  if (!req.body.feedback) req.body.feedback = req.params.feedbackId;
  next();
};

export const setImageOnBody = (req, res, next) => {
  if (req.file) {
    req.body.image = [`${Date.now()}-${req.file.originalname}`];
  }
  next();
};
