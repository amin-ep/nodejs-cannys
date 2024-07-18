import Joi from 'joi';

const schema = {
  fullName: Joi.string().min(4).max(16).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).max(12).optional(),
  currentPassword: Joi.string().required(),
  image: Joi.string().optional(),
  role: Joi.string().optional(),
  verified: Joi.boolean().optional(),
  active: Joi.boolean().optional(),
};

export const updateUserValidator = Joi.object(schema);

export const updateMeValidator = Joi.object(schema).fork(
  ['password', 'role', 'verified', 'active', 'currentPassword'],
  schema => schema.forbidden(),
);

export const changeMyPasswordValidator = Joi.object(schema)
  .fork(['fullName', 'email', 'image', 'role', 'verified', 'active'], schema =>
    schema.forbidden(),
  )
  .fork(['password', 'currentPassword'], schema => schema.required());
