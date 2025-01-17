import Joi from 'joi';

const schema = {
  user: Joi.string().required(),
  title: Joi.string().min(5).required(),
  body: Joi.string().max(200),
  image: Joi.array(),
};

export const createFeedbackValidator = Joi.object(schema);

export const updateFeedbackValidator = Joi.object(schema)
  .fork(['user'], schema => schema.forbidden())
  .fork(['title'], schema => schema.optional());
