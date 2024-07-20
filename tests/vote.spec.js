/* eslint-disable no-undef */
import request from 'supertest';
import app from '../app.js';
import {
  clearData,
  connect,
  disconnect,
} from '../helpers/mongodb.memory.test.helper.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

import { config } from 'dotenv';
import Vote from '../models/Vote.js';
import Feedback from '../models/Feedback.js';

config({ path: '.env' });

describe('Vote', () => {
  const generateJWTToken = id => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
    return token;
  };
  const createDummyUser = async body => {
    const user = await User.create(body);
    user.verified = true;
    await user.save({ validateBeforeSave: false });
    return user;
  };

  const createDummyFeedback = async userId => {
    const feedback = await Feedback.create({ title: 'title', user: userId });
    return feedback;
  };

  beforeAll(connect);
  afterAll(disconnect);
  afterEach(clearData);

  describe('Toggle Vote', () => {
    it.only('should return 204 if vote exists and user tries to vote again', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };

      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user.id);
      const feedback = await createDummyFeedback(user.id);
      const voteObj = {
        user: user.id,
        feedback: feedback.id,
      };
      await Vote.create(voteObj);

      const res = await request(app)
        .post('/api/v1/votes')
        .set('Authorization', `Bearer ${token}`)
        .send(voteObj);
      expect(res.statusCode).toBe(204);
    });

    it.only('should return 201 and create a new vote', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };

      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user.id);
      const feedback = await createDummyFeedback(user.id);
      const voteObj = {
        user: user.id,
        feedback: feedback.id,
      };

      const res = await request(app)
        .post('/api/v1/votes')
        .set('Authorization', `Bearer ${token}`)
        .send(voteObj);
      expect(res.statusCode).toBe(201);
    });
  });
});
