import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import {
  signupValidator,
  loginValidator,
  forgetPasswordValidator,
  resetPasswordValidator,
} from '../validators/authValidator.js';
import HTTPError from '../errors/httpError.js';
import sendMail from '../email/email.js';

export default class AuthController {
  //  GENERATE TOKEN
  generateToken(user) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIERES,
    });
    return token;
  }

  // SEND EMAIL
  async sendEmail(user, res, message) {
    const key = user.generateVerifyKey();
    const link = `${req.protocol}://localhost:${process.env.PORT}/api/v1/auth/verifyEmail/${key}`;
    const html = `
      Please click this <a href="${link}">Link</a> to verify your email address!
    `;
    try {
      // user.emailVerifyCode = key;
      await user.save({ validateBeforeSave: false });
      await sendMail({
        email: user.email,
        subject: `This is your email verification key: ${key}`,
        message: key,
        html: html,
      });
      res.status(201).json({
        status: 'success',
        message: message,
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'something went wrong!',
        err,
      });
    }
  }

  // REGISTER
  register = catchAsync(async (req, res, next) => {
    const { error, value } = signupValidator.validate(req.body);

    if (error) {
      return next(new HTTPError(error.message, 400));
    }

    const checkUserDocument = await User.findOne({ email: req.body.email });

    const message = `An email sent to ${req.body.email}. Please verify your email!`;
    if (!checkUserDocument) {
      const user = await User.create(req.body);
      this.sendEmail(user, res, message);
    } else if (checkUserDocument && checkUserDocument.verified === false) {
      this.sendEmail(checkUserDocument, res, message);
    } else if (checkUserDocument) {
      return next(new HTTPError('There is an account with this email!', 403));
    }
  });

  // VERIFY EMAIL
  verifyEmail = catchAsync(async (req, res, next) => {
    // find user by verifyKey
    const user = await User.findOne({ emailVerifyCode: req.params.key });

    if (!user) {
      return next(new HTTPError('Invalid key', 400));
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
    // Validate input data
    const { error } = loginValidator.validate(req.body);

    if (error) {
      return next(new HTTPError(error.message, 400));
    }
    // find user
    const user = await User.findOne({ email: req.body.email }).select(
      '+password',
    );

    if (
      !user ||
      !(await user.verifyPassword(req.body.password)) //FIXME
    ) {
      return next(new HTTPError('Icorrect email or password', 400));
    }
    const token = this.generateToken(user);

    if (user.verified === false) {
      return next(new HTTPError('This account is not verified yet', 401));
    }

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
    // validate input email
    const { error } = forgetPasswordValidator.validate(req.body);

    if (error) {
      return next(new HTTPError(error.message, 400));
    }
    // get user by email
    const user = await User.findOne({ email: req.body.email });
    // check user
    if (!user) {
      return next(new HTTPError('There is no user with this email!', 404));
    }
    // generate reset token and token expiere date to user
    // send email to user

    // REFACTOR THIS CODE (DON'T REPEAT YOURSELF)
    // const link = `http://localhost:1337/api/v1/auth/resetPassworrd/${resetToken}`;
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const html = `
        <p>This is your reset Token: ${resetToken}</p>
  `;
    try {
      // user.emailVerifyCode = key;
      await sendMail({
        email: user.email,
        subject: `This is your password reset token: ${resetToken} (Valid for 10 minutes)`,
        message: resetToken,
        html: html,
      });

      res.status(200).json({
        status: 'success',
        message: `An email sent to ${req.body.email}`,
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'something went wrong!',
        err,
      });
    }
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
    // validate input data
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

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
    // send response
  });
}
