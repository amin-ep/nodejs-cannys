import Joi from 'joi';

const schema = {
  user: Joi.string().required(),
  feedback: Joi.string().required(),
  parentComment: Joi.string(),
  text: Joi.string().required(),
  image: Joi.array(),
  published: Joi.boolean().forbidden(),
};

export const createCommentValidator = Joi.object(schema);

export const updateCommentValidator = Joi.object(schema)
  .fork(['user', 'feedback'], schema => schema.forbidden())
  .fork(['parentComment', 'text', 'image', 'published'], schema =>
    schema.optional(),
  );
