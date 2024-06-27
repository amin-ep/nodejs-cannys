import catchAsync from '../utils/catchAsync.js';
import User from '../models/User.js';
import HTTPError from '../errors/httpError.js';
import Factory from './handlerFactory.js';
import {
  changeMyPasswordValidator,
  updateMeValidator,
  updateUserValidator,
} from '../validators/userValidator.js';
import sendMail from '../email/email.js';

class UserController extends Factory {
  constructor() {
    super(User, undefined, updateUserValidator);
  }
  updateMe = catchAsync(async (req, res, next) => {
    const { error } = updateMeValidator.validate(req.body);

    if (error) {
      return next(new HTTPError(error.message, 400));
    }

    if (req.body.email) {
      const checkInputEmail = await User.findOne({ email: req.body.email });
      if (checkInputEmail) {
        return next(new HTTPError('There is an account with this email!', 400));
      }
      const user = await User.findByIdAndUpdate(req.user.id, { ...req.body });
      const key = user.generateVerifyKey();
      user.emailVerifyCode = key;
      await user.save({ validateBeforeSave: false });

      const html = `
      <a href="http://localhost:3000/api/auth/v1/verifyEmail"></a>
    `;
      try {
        await sendMail({
          email: req.body.email,
          subject: `this is your email verfy key: ${key}`,
          message: key,
          html: html,
        });
        res.status(200).json({
          status: 'success',
          message: `An email sent to ${req.body.email}. Please verify your email account`,
        });
      } catch {
        res.status(500).json({
          status: 'error',
          message: 'something went wrong!',
          err,
        });
      }
    } else {
      const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        returnOriginal: false,
      });

      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    }
  });

  updateMyPassword = catchAsync(async (req, res, next) => {
    const { error } = changeMyPasswordValidator.validate(req.body);

    if (error) {
      return next(new HTTPError(error.message, 400));
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.verifyPassword(req.body.currentPassword))) {
      return next(new HTTPError('your current password is wrong', 400));
    }
    console.log(await user.verifyPassword(req.body.password));

    user.password = req.body.password;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  });

  deleteMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    user.active = false;
    await user.save({ validateBeforeSave: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  // middlewares

  getMe(req, res, next) {
    req.params.id = req.user.id;
    next();
  }

  protectRoleField(req, res, next) {}
}

export default UserController;
