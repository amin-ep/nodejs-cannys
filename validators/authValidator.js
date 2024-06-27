import Joi from 'joi';

export const signupValidator = Joi.object({
  fullName: Joi.string().min(4).max(16).required().messages({
    'string.empty': 'please tell us your "fullName"',
    'string.min': '"fullName" must contain atleast 4 chracters atleast!',
    'string.max': `"fullName" cannot contain morer than 16 charcters!`,
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'please input a valid "email"',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'please provide a "fullName"',
    'string.min': '"password" must contain atleast 8 chracters atleast!',
    'string.max': `"password" cannot contain morer than 12 charcters!`,
  }),
  photo: Joi.string(),
  role: Joi.string().valid('admin', 'user').default('user'),
});

export const loginValidator = signupValidator.fork(
  ['fullName', 'role'],
  schema => schema.forbidden(),
);

export const forgetPasswordValidator = signupValidator.fork(
  ['role', 'fullName', 'password', 'photo'],
  schema => schema.forbidden(),
);

export const resetPasswordValidator = signupValidator.fork(
  ['fullName', 'email', 'photo', 'role'],
  schema => schema.forbidden(),
);
