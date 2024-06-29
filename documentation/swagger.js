import { userDocs } from './user.docs.js';
import { authDocs } from './auth.docs.js';
import { feedbackDocs } from './feedback.docs.js';
import { voteDocs } from './vote.docs.js';
import { commentDocs } from './comment.docs.js';

export const swaggerDocumentation = {
  openapi: '3.0.0',
  info: {
    title: `Canny's Clone`,
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Local Dev',
    },
  ],
  tags: [
    {
      name: 'User',
      description: 'User routes',
    },
    {
      name: 'Auth',
      description: 'Auth routes',
    },
    {
      name: 'Feedback',
      description: 'Feedback routes',
    },
    {
      name: 'Vote',
      description: 'Vote routes',
    },
    {
      name: 'Comment',
      description: 'Comment routes',
    },
  ],
  paths: {
    ...userDocs,
    ...authDocs,
    ...feedbackDocs,
    ...voteDocs,
    ...commentDocs,
  },
};
