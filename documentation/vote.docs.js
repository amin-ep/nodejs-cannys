const getAllVotes = {
  tags: ['Vote'],
  description: 'List all of the Votes',
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              user: '665dd76b2a1d4c12b519c80b',
              feedback: '665dd76b2a1d4c12b519c80b',
            },
          },
        },
      },
    },
  },
};

const toggleVote = {
  tags: ['Vote'],
  description: 'toggle vote on feedback',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            feedback: {
              type: 'string',
              description: 'id of feedback that the user wants to vote',
              example: '665dc54aba28c34e6c5d6a03',
            },
            user: {
              type: 'string',
              description: 'id of user that votes up the feedback',
              example: '665dc54aba28c34e6c5d6a03',
            },
          },
          required: ['feedback', 'user'],
        },
      },
    },
  },
  responses: {
    201: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              user: '665dd76b2a1d4c12b519c80b',
              feedback: '665dd76b2a1d4c12b519c80b',
            },
          },
        },
      },
    },
    204: {
      description: 'No Content!',
    },
  },
};

const getVoteById = {
  tags: ['Vote'],
  description: 'Get a vote by id',
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
              user: '665dd76b2a1d4c12b519c80b',
              feedback: '665dd76b2a1d4c12b519c80b',
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

const deleteVote = {
  tags: ['Vote'],
  description: 'Delete a vote based on Id',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'ObjectId',
      },
      description: 'vote id',
    },
  ],

  responses: {
    204: {
      description: 'No content',
    },

    404: {
      description: 'Invalid Id: 6679378d6f27ab019a82d3e1',
    },
  },
};

const getAllVotesOnFeedback = {
  tags: ['Votes'],
  description: 'List all of the Votes of a feedback (Nested route)',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'ObjectId',
      },
      description: 'vote id',
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
              user: '665dd76b2a1d4c12b519c80b',
              feedback: '665dd76b2a1d4c12b519c80b',
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

const toggleVoteOnFeedback = {
  tags: ['Vote'],
  description: 'toggle vote on feedback via feedbackId (Nested route)',
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
            feedback: {
              type: 'string',
              description: 'id of feedback that the user wants to vote',
              example: '665dc54aba28c34e6c5d6a03',
            },
            user: {
              type: 'string',
              description: 'id of user that votes up the feedback',
              example: '665dc54aba28c34e6c5d6a03',
            },
          },
          required: ['feedback', 'user'],
        },
      },
    },
  },
  responses: {
    201: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              user: '665dd76b2a1d4c12b519c80b',
              feedback: '665dd76b2a1d4c12b519c80b',
            },
          },
        },
      },
    },
    204: {
      description: 'No Content!',
    },
  },
};

export const voteDocs = {
  '/votes': {
    get: getAllVotes,
    post: toggleVote,
  },
  '/votes/{id}': {
    get: getVoteById,
    delete: deleteVote,
  },
  '/feedbacks/{feedbackId}/votes': {
    get: getAllVotesOnFeedback,
    post: toggleVoteOnFeedback,
  },
};
