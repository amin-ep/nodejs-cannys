import Joi from 'joi';

const schema = {
  user: Joi.string().required(),
  feedback: Joi.string().required(),
};

export const voteValidator = Joi.object(schema);
