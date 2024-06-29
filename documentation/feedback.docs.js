const getAllFeedbacks = {
  tags: ['Feedback'],
  description: 'List of all Feedbacks',
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            examples: {
              user: '6679378d6f27ab019a82d3e1',
              title:
                'Allow GitHub/GitLab accounts to be connected to multiple Render accounts',
              body: 'If you have multiple Render accounts, it can be helpful to be able to attach the same GitHub/GitLab account to multiple Render users.',
              images: ['image1.jpg', 'image2.jpg'],
              slug: 'allow-gitHub/gitLab-accounts-to-be-connected-to-multiple-render-accounts',
            },
          },
        },
      },
    },
    401: {
      description: 'You are not logged in, it needs a JWT token',
    },
  },
};
const createFeedback = {
  tags: ['Feedback'],
  description: 'Create a Feedback',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: {
              type: 'string',
              description: 'A user id that wants to create a feedback',
              example: '6679378d6f27ab019a82d3e1',
            },
            title: {
              type: 'string',
              description: 'Title of your feedback that you want to create',
              example:
                'Allow GitHub/GitLab accounts to be connected to multiple Render accounts',
            },
            body: {
              type: 'string',
              description: 'some explaination about your feedback',
              example:
                'If you have multiple Render accounts, it can be helpful to be able to attach the same GitHub/GitLab account to multiple Render users.',
            },
            images: {
              type: 'string',
              description: 'Imags about your feedback if you want',
              example: ['image1.jpg', 'image2.jpg'],
            },
          },
          required: ['title', 'user'],
        },
      },
    },
  },
  responses: {
    201: {
      description: 'post created',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              user: '6679378d6f27ab019a82d3e1',
              title:
                'Allow GitHub/GitLab accounts to be connected to multiple Render accounts',
              body: 'If you have multiple Render accounts, it can be helpful to be able to attach the same GitHub/GitLab account to multiple Render users.',
              images: ['image1.jpg', 'image2.jpg'],
            },
          },
        },
      },
    },
    400: {
      description: 'Bad request! invalid data sent or some fields are required',
    },
  },
};
const getFeedbackById = {
  tags: ['Feedback'],
  description: 'Get a feedback by id',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'ObjectId',
      },
      description: 'feedback id',
    },
  ],
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              user: '6679378d6f27ab019a82d3e1',
              title:
                'Allow GitHub/GitLab accounts to be connected to multiple Render accounts',
              body: 'If you have multiple Render accounts, it can be helpful to be able to attach the same GitHub/GitLab account to multiple Render users.',
              images: ['image1.jpg', 'image2.jpg'],
            },
          },
        },
      },
    },
    404: {
      description: 'Not found!',
    },
  },
};

const deleteFeedback = {
  tags: ['Feedback'],
  description: 'Delete a feedback based on Id',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'ObjectId',
      },
      description: 'feedback id',
    },
  ],

  responses: {
    204: {
      description: 'No content',
    },

    404: {
      description: 'User not found!',
    },
  },
};

const updateFeedback = {
  tags: ['Feedback'],
  description: 'Update feedback',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'ObjectId',
      },
      description: 'feedback id',
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: {
              type: 'string',
              description: 'A user id that wants to create a feedback',
              example: '6679378d6f27ab019a82d3e1',
            },
            title: {
              type: 'string',
              description: 'Title of your feedback that you want to create',
              example:
                'Allow GitHub/GitLab accounts to be connected to multiple Render accounts',
            },
            body: {
              type: 'string',
              description: 'some explaination about your feedback',
              example:
                'If you have multiple Render accounts, it can be helpful to be able to attach the same GitHub/GitLab account to multiple Render users.',
            },
            images: {
              type: 'string',
              description: 'Imags about your feedback if you want',
              example: ['image1.jpg', 'image2.jpg'],
            },
          },
        },
      },
    },
  },

  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              user: '6679378d6f27ab019a82d3e1',
              title:
                'Allow GitHub/GitLab accounts to be connected to multiple Render accounts',
              body: 'If you have multiple Render accounts, it can be helpful to be able to attach the same GitHub/GitLab account to multiple Render users.',
              images: ['image1.jpg', 'image2.jpg'],
            },
          },
        },
      },
    },

    400: {
      description:
        'Bad Request: invalid data sent or some fields are required!',
    },
    404: {
      description: 'feedback not found!',
    },
  },
};

export const feedbackDocs = {
  '/feedbacks': {
    get: getAllFeedbacks,
    post: createFeedback,
  },
  '/feedback/{id}': {
    get: getFeedbackById,
    path: updateFeedback,
    delete: deleteFeedback,
  },
};
