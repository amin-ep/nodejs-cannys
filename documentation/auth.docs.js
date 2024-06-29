const register = {
  tags: ['Auth'],
  description: 'Create a user account with authentication',
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            fullName: {
              type: 'string',
              description: 'Add your name (required field)',
              example: 'Jhon Doe',
            },
            email: {
              type: 'string',
              description: 'Add your email (required field)',
              example: 'info@example.io',
            },
            password: {
              type: 'string',
              description: 'Add your password (required field)',
              example: 'password1234',
            },
          },
          required: ['fullName', 'email', 'password'],
        },
      },
    },
  },
  responses: {
    201: {
      description: 'A verify key send to your email',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  fullName: { type: 'string' },
                  email: { type: 'string' },
                  image: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    400: {
      description: 'Bad Request',
    },
    403: {
      description: 'There is an email with this email!',
    },
  },
};

const verifyEmail = {
  tags: ['Auth'],
  description: 'Verify your account via key that sent to you',
  parameters: [
    {
      name: 'key',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'uuid',
      },
      description: 'Verification key',
    },
  ],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              email: 'info@email.io',
              username: 'username123',
              password: 'hashedpassword',
            },
          },
        },
      },
    },

    400: {
      description: 'verification key expired or invalid!',
    },
  },
};

const login = {
  tags: ['Auth'],
  description: 'Log into your account',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'your email',
              example: 'info@email.io',
            },
            password: {
              type: 'string',
              description: 'a password that contains atleast 8 charcters',
              expamle: 'password1234',
            },
          },
          required: ['email', 'password'],
        },
      },
    },
  },
  responses: {
    200: {
      description: 'you are logged in',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              email: 'info@email.io',
              username: 'username123',
              password: 'password123',
              verified: true,
            },
          },
        },
      },
    },
    400: {
      description: 'Incorrect email or password!',
    },
    429: {
      description: 'To many requests',
    },
  },
};

const forgetPassword = {
  tags: ['Auth'],
  description: 'A forget password route',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description:
                'use your email to send you a veridy code for changing password',
              example: 'info@email.io',
            },
          },
          required: ['email'],
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          message: 'key sent to your email!',
        },
      },
    },

    404: {
      description: 'there is no user with this email!',
    },
  },
};

const resetPassword = {
  tags: ['Auth'],
  description: 'Reset your password',
  parameters: [
    {
      name: 'key',
      in: 'query',
      description: 'key that sent to email',
      type: 'string',
      example: '6679378d6f27ab019a82d3e1',
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            password: {
              type: 'string',
              description: 'a password that contains atleast 8 charcters',
              example: 'password123',
            },
          },
          required: ['password'],
        },
      },
    },
  },

  responses: {
    200: {
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
      description: 'Invalid password sent',
    },
  },
};

export const authDocs = {
  '/auth/register': {
    post: register,
  },
  '/auth/login': {
    post: login,
  },
  '/auth/verifyEmail/{key}': {
    post: verifyEmail,
  },
  '/auth/forgetPassword': {
    post: forgetPassword,
  },
  '/auth/resetPassword': {
    patch: resetPassword,
  },
};
