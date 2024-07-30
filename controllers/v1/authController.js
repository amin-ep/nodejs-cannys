/* eslint-disable no-undef */
import User from '../../models/User.js';
import catchAsync from '../../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import { resetPasswordValidator } from '../../validators/authValidator.js';
import HTTPError from '../../errors/httpError.js';
import sendEmail from '../../helpers/sendEmail.js';

export default class AuthController {
  //  GENERATE TOKEN
  generateToken(user) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
    return token;
  }

  // REGISTER
  register = catchAsync(async (req, res, next) => {
    const checkUserExists = await User.findOne({ email: req.body.email });

    const message = `An email sent to ${req.body.email}. Please verify your email!`;

    if (!checkUserExists) {
      const user = await User.create(req.body);
      const key = user.generateVerifyKey();
      await user.save({ validateBeforeSave: false });
      const link = `${req.protocol}://${req.get('host')}/api/v1/verifyEmail/${key}`;
      const html = `
        <p>To confirm your email address please click <a href="${link}"></a> 
      `;
      await sendEmail(
        { email: req.body.email, subject: key, message, html },
        res,
        201,
      );
    } else if (checkUserExists && checkUserExists.verified === false) {
      const key = checkUserExists.generateVerifyKey();
      await checkUserExists.save({ validateBeforeSave: false });
      const link = `${req.protocol}://${req.get('host')}/api/v1/verifyEmail/${key}`;
      const html = `
        <p>To confirm your email address please click <a href="${link}"></a> </p>
      `;
      // this.sendEmail(user, res, message);
      await sendEmail(
        { email: req.body.email, subject: key, message, html },
        res,
        200,
      );
    } else if (checkUserExists && checkUserExists.active === false) {
      checkUserExists.active = true;
      checkUserExists.verified = false;
      const key = checkUserExists.generateVerifyKey();
      const link = `${req.protocol}://${req.get('host')}/api/v1/verifyEmail/${key}`;
      const html = `
        <p>To confirm your email address please click <a href="${link}"></a> 
      `;
      await sendEmail(
        { email: req.body.email, subject: key, message, html },
        res,
        201,
      );
      await checkUserExists.save({ validateBeforeSave: false });
    } else if (checkUserExists && checkUserExists.verified === true) {
      return next(new HTTPError('There is an account with this email!', 403));
    }
  });

  // VERIFY EMAIL
  verifyEmail = catchAsync(async (req, res, next) => {
    // find user by verifyKey
    const user = await User.findOne({ emailVerifyCode: req.params.key });

    if (!user) {
      return next(new HTTPError('Invalid key', 404));
    }
    // verify user (update user)
    user.emailVerifyCode = undefined;
    user.verified = true;
    await user.save({ validateBeforeSave: false });

    // create token
    const token = this.generateToken(user);

    // send response
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  });

  // LOGIN
  login = catchAsync(async (req, res, next) => {
    // find user
    const user = await User.findOne({ email: req.body.email }).select(
      '+password',
    );

    if (user.verified === false) {
      return next(new HTTPError('This account is not verified yet', 401));
    }

    if (
      !user ||
      user.active === false ||
      !(await user.verifyPassword(req.body.password))
    ) {
      return next(new HTTPError('Incorrect email or password', 400));
    }

    const token = this.generateToken(user);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  });

  // FORGET PASSWORD
  forgetPassword = catchAsync(async (req, res, next) => {
    // get user by email
    const user = await User.findOne({ email: req.body.email });
    // check user
    if (!user) {
      return next(new HTTPError('There is no user with this email!', 404));
    }
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const html = `
        <p>This is your reset Token: ${resetToken}</p>
  `;
    const message = `An email sent to ${req.body.email}. Please verify your email!`;
    await sendEmail(
      { email: req.body.email, subject: resetToken, message, html },
      res,
      200,
    );
  });

  resetPassword = catchAsync(async (req, res, next) => {
    // get user bt reset token
    const user = await User.findOne({
      passwordResetToken: req.params.token,
      resetTokenExpieresAt: { $gt: Date.now() },
    });

    if (!user) {
      return next(new HTTPError('Invalid or expiered token', 404));
    }

    const { error } = resetPasswordValidator.validate(req.body);

    if (error) {
      return next(new HTTPError(error.message, 400));
    }

    // update user data
    user.password = req.body.password;
    user.passwordChangedAt = Date.now();
    user.passwordResetToken = undefined;
    user.resetTokenExpieresAt = undefined;
    await user.save({ validateBeforeSave: false });

    // send response
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  });
}
