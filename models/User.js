import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import moment from 'moment';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      index: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    emailVerifyCode: String,
    passwordResetToken: String,
    resetTokenExpieresAt: Date,
    passwordChangedAt: Date,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// MIDDLEWARES
userSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// INSTANCE METHODS
userSchema.methods.generateVerifyKey = function () {
  this.emailVerifyCode = uuid();
  return this.emailVerifyCode;
};

userSchema.methods.verifyPassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.generatePasswordResetToken = function () {
  this.passwordResetToken = uuid();
  this.resetTokenExpieresAt = moment(Date.now()).add(10, 'minutes');
  return this.passwordResetToken;
};

userSchema.methods.passwordChangedAfter = function (JWTGeneratedAt) {
  if (this.passwordChangedAt) {
    console.log(JWTGeneratedAt < this.passwordChangedAt.getTime() / 1000);
    return JWTGeneratedAt < this.passwordChangedAt.getTime() / 1000;
  }
  return false;
};

export default mongoose.model('User', userSchema);
