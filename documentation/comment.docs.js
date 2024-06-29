const getAllComments = {
  tags: ['Comment'],
  description: 'List all of the Comments',
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              text: 'some texts',
              feedback: '665dc54aba28c34e6c5d6a03',
              images: ['image1.jpg', 'image2.jpg'],
              user: '665dc54aba28c34e6c5d6a03',
            },
          },
        },
      },
    },
  },
  404: {
    description: 'Not found!',
  },
};

const craeteComment = {
  tags: ['Comment'],
  description: 'Create a Comment',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'opinion about feedback',
              example: 'nice',
            },
            feedback: {
              type: 'string',
              description: 'feedback id',
              example: '665dc54aba28c34e6c5d6a03',
            },
            user: {
              type: 'string',
              description: 'id of user that published the feedback',
              example: '665dc54aba28c34e6c5d6a03',
            },
            images: {
              type: 'array',
              description: 'Some images about comment',
              example: ['image1.jpg', 'image2.jpg'],
            },
            parentComment: {
              type: 'string',
              description:
                'this is for replies on comments, if a comment has a parentComment field it means that is a reply of a comment',
              example: 'some text',
            },
          },
          required: ['text', 'feedback', 'user'],
        },
      },
    },
  },
  responses: {
    201: {
      description: 'comment created',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              text: 'some texts',
              feedback: '665dc54aba28c34e6c5d6a03',
              images: ['image1.jpg', 'image2.jpg'],
              user: '665dc54aba28c34e6c5d6a03',
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

const getComment = {
  tags: ['Comment'],
  description: 'Get a comment by id',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'ObjectId',
      },
      description: 'comment id',
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
              text: 'some texts',
              feedback: '665dc54aba28c34e6c5d6a03',
              images: ['image1.jpg', 'image2.jpg'],
              user: '665dc54aba28c34e6c5d6a03',
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

const updateComment = {
  tags: ['Comment'],
  description: 'Update comment',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'ObjectId',
      },
      description: 'comment id',
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'opinion about a feedback',
              example: 'some text',
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
              text: 'some texts',
              feedback: '665dc54aba28c34e6c5d6a03',
              images: ['image1.jpg', 'image2.jpg'],
              user: '665dc54aba28c34e6c5d6a03',
            },
          },
        },
      },
    },

    404: {
      description: 'Invalid Id: 665dc54aba28c34e6c5d6a03',
    },

    400: {
      description: 'invalid data sent',
    },
  },
};

const deleteComment = {
  tags: ['Comment'],
  description: 'Delete a comment based on Id',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'ObjectId',
      },
      description: 'comment id',
    },
  ],

  responses: {
    204: {
      description: 'No content',
    },

    404: {
      description: 'comment not found!',
    },
  },
};

const createReply = {
  tags: ['Comment'],
  description: 'Create a Comment',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'anything',
              example: 'santiago bernabeu stadium',
            },
            post: {
              type: 'string',
              description: 'post id',
              example: '665dc54aba28c34e6c5d6a03',
            },
            user: {
              type: 'string',
              description: 'id of user that published the post',
              example: '665dc54aba28c34e6c5d6a03',
            },
            parentComment: {
              type: 'string',
              description:
                'this is for replies on comments, if a comment has a parentComment field it means that is a reply of a comment',
              example: 'some text',
            },
          },
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
              text: 'some texts',
              user: '665dc54aba28c34e6c5d6a03',
              post: '665dc54aba28c34e6c5d6a03',
              parentComment: '665dc54aba28c34e6c5d6a03',
              createdAt: '2024-06-03T14:46:05.528+00:00',
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

const getAllCommentsOnFeedback = {
  tags: ['Comment'],
  description: 'List all of the Comments of a feedback (Nested route)',
  parameters: [
    {
      name: 'feedbackId',
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
              text: 'some texts',
              feedback: '665dc54aba28c34e6c5d6a03',
              images: ['image1.jpg', 'image2.jpg'],
              user: '665dc54aba28c34e6c5d6a03',
            },
          },
        },
      },
    },
  },
  404: {
    description: 'Not found!',
  },
};

const craeteCommentOnFeedback = {
  tags: ['Comment'],
  description: 'Create a Comment for a feedback by feddbackId (Nested route)',
  parameters: [
    {
      name: 'feedbackId',
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
            text: {
              type: 'string',
              description: 'opinion about feedback',
              example: 'nice',
            },
            feedback: {
              type: 'string',
              description: 'feedback id',
              example: '665dc54aba28c34e6c5d6a03',
            },
            user: {
              type: 'string',
              description: 'id of user that published the feedback',
              example: '665dc54aba28c34e6c5d6a03',
            },
            images: {
              type: 'array',
              description: 'Some images about comment',
              example: ['image1.jpg', 'image2.jpg'],
            },
            parentComment: {
              type: 'string',
              description:
                'this is for replies on comments, if a comment has a parentComment field it means that is a reply of a comment',
              example: 'some text',
            },
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: 'comment created',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              text: 'some texts',
              feedback: '665dc54aba28c34e6c5d6a03',
              images: ['image1.jpg', 'image2.jpg'],
              user: '665dc54aba28c34e6c5d6a03',
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

export const commentDocs = {
  '/comments': {
    get: getAllComments,
    post: craeteComment,
  },
  '/comments/{id}': {
    get: getComment,
    patch: updateComment,
    delete: deleteComment,
  },
  '/comments/replies': {
    post: createReply,
  },
  '/feedbacks/{feedbackId}/comments': {
    get: getAllCommentsOnFeedback,
    post: craeteCommentOnFeedback,
  },
};
