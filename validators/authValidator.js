import Joi from 'joi';

const schema = {
  fullName: Joi.string().min(4).max(16).required().messages({
    'string.empty': 'please tell us your "fullName"',
    'string.min': '"fullName" must contain atleast 4 chracters atleast!',
    'string.max': `"fullName" cannot contain morer than 16 charcters!`,
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'please input a valid "email"',
  }),
  password: Joi.string().min(6).max(12).required().messages({
    'string.empty': 'please provide a "fullName"',
    'string.min': '"password" must contain atleast 8 chracters atleast!',
    'string.max': `"password" cannot contain morer than 12 charcters!`,
  }),
  image: Joi.string(),
};
export const registerValidator = Joi.object(schema);

export const loginValidator = Joi.object(schema).fork(
  ['fullName', 'image'],
  schema => schema.forbidden(),
);

export const forgetPasswordValidator = Joi.object(schema).fork(
  ['fullName', 'password', 'image'],
  schema => schema.forbidden(),
);

export const resetPasswordValidator = Joi.object(schema).fork(
  ['fullName', 'email', 'image'],
  schema => schema.forbidden(),
);
