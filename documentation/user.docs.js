const getAllUsers = {
  tags: ['User'],
  description: 'List of all verified and active users',
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            examples: {
              fullName: 'Jhon Doe',
              email: 'info@example.com',
              image: 'image.jpg',
              role: 'user',
              verified: true,
              active: true,
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

const getUser = {
  tags: ['User'],
  description: 'Get a user by Id',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'ObjectId',
      },
      description: 'user id',
    },
  ],
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            examples: {
              fullName: 'Jhon Doe',
              email: 'info@example.com',
              image: 'image.jpg',
              role: 'user',
              verified: true,
              active: true,
            },
          },
        },
      },
    },
    404: {
      description: 'Not found! id is invalid id',
    },
  },
};

const getMe = {
  tags: ['User'],
  description: 'Get user based on authorization token (get your account)',
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              email: 'info@email.io',
              fullName: 'Jhon Doe',
              password: 'hashedpassword',
            },
          },
        },
      },
    },
  },
};

const updateMe = {
  tags: ['User'],
  description: 'Update user based on authorization token(upodate your account)',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'a password that contains atleast 8 charcters',
              example: 'password123',
            },
            fullName: {
              type: 'string',
              description: 'a unique fullName',
              example: 'Jhon Doe',
            },
          },
        },
      },
    },
  },
};

const deleteMe = {
  tags: ['User'],
  description: 'Delete user based on authorization token',
  responses: {
    204: {
      description: 'No content',
    },
  },
};

const updateMyPassword = {
  tags: ['User'],
  description:
    'Update user password based on authorization token(change your password)',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            password: {
              type: 'string',
              expamle: 'newPassword',
              description: 'a password that contains atleast 8 charcters',
            },
            currentPassword: {
              type: 'string',
              example: 'password123',
              description: 'Your current password',
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
              email: 'info@email.io',
              username: 'username123',
              password: 'hashedpassword',
              role: 'user',
              verified: true,
              createdAt: 'Date',
            },
          },
        },
      },
    },

    400: {
      description:
        'Bad Request: invalid email or username or user wants to update password!',
    },

    404: {
      description: 'User not found!',
    },
  },
};

const updateUser = {
  tags: ['User'],
  description: 'Update user',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'ObjectId',
      },
      description: 'user id',
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'a password that contains atleast 8 charcters',
              example: 'password123',
            },
            fullName: {
              type: 'string',
              description: 'a unique fullName',
              example: 'Jhon Doe',
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
              email: 'info@email.io',
              fullName: 'Jhon Doe',
              password: 'hashedpassword',
            },
          },
        },
      },
    },

    400: {
      description:
        'Bad Request: invalid email or username or user wants to update password!',
    },
    404: {
      description: 'User not found!',
    },
  },
};

export const userDocs = {
  '/users': {
    get: getAllUsers,
  },
  '/users/{id}': {
    get: getUser,
    patch: updateUser,
  },
  '/users/me': {
    get: getMe,
  },
  '/users/updateMe': {
    patch: updateMe,
  },
  '/users/deleteMe': {
    delete: deleteMe,
  },
  '/users/updateMyPassword': {
    patch: updateMyPassword,
  },
};
