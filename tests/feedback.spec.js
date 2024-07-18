/* eslint-disable no-undef */
import request from 'supertest';
import app from '../app.js';
import {
  clearData,
  connect,
  disconnect,
} from '../helpers/mongodb.memory.test.helper.js';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';

config({ path: '.env' });

describe('feedbacks', () => {
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

  // GET all feedbacks
  describe('GET / get all feedbacks', () => {
    it('should return 404 if url is wrong', async () => {
      const res = await request(app).get('/api/v1/feedbackss');
      expect(res.statusCode).toBe(404);
    });
    it('should return 200 if url is correct', async () => {
      const res = await request(app).get('/api/v1/feedbacks');
      expect(res.statusCode).toBe(200);
    });
  });

  // GET feedback by id
  describe('GET / get feedback by id', () => {
    it('should return 401 if token not set (user is not logged in)', async () => {
      const id = '66975fe1558e7bd428f73a0c';
      const token = '';
      const res = await request(app)
        .get(`/api/v1/feedbacks/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.unauthorized).toBeTruthy();
      expect(res.statusCode).toBe(401);
    });
    it('should return 404 if id is invalid', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };
      const user = await createDummyUser(userObj);
      user.verified = true;
      await user.save({ validateBeforeSave: false });
      const id = '66975fe1558e7';

      const token = generateJWTToken(user._id);

      const res = await request(app)
        .get(`/api/v1/feedbacks/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });

    it('should return 404 if id is valid but docs does not exists', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };
      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user._id);
      const id = '667baf5286a240c08ae6d091';
      const res = await request(app)
        .get(`/api/v1/feedbacks/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });
    it('should return 401 if token is invalid', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OTY0ODQ5M2Q2MjkyMjkyYTFkNDNlMiIsImlhdCI6MTcyMTEzNzA4NSwiZXhwIjoxNzIxOTE0Njg1fQ.VPdmJzGVpf_Gjq7tnYi1VffYLlkjtBoy_BK4xf_FXIc';

      const id = '66975fe1558e7bd428f73a0c';
      const res = await request(app)
        .get(`/api/v1/feedbacks/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST / create feedback', () => {
    it('should return 401 if token not set (user is not logged in)', async () => {
      const token = '';
      const res = await request(app)
        .post(`/api/v1/feedbacks`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.unauthorized).toBeTruthy();
      expect(res.statusCode).toBe(401);
    });

    it('should return 400 if body does not contain title', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };

      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user._id);

      const feedbackObj = {
        user: user.id,
      };

      const res = await request(app)
        .post('/api/v1/feedbacks')
        .send(feedbackObj)
        .set('Authorization', `Bearer ${token}`);
      expect(res.body).not.toContain('user');
    });

    it('should return 400 if title is invalid', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };

      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user._id);

      const feedbackObj = {
        user: user._id,
        title: 'inv',
      };

      const res = await request(app)
        .post('/api/v1/feedbacks')
        .send(feedbackObj)
        .set('Authorization', `Bearer ${token}`);
      expect(res.body.status).toBe('fail');
      expect(res.statusCode).toBe(400);
    });
  });

  describe('PATCH / update feedback', () => {
    it('should return 404 if id is invalid', async () => {
      const id = 'asdfghjkl';

      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };
      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user.id);

      const feedbackObj = {
        title: 'changing title',
      };

      const res = await request(app)
        .patch(`/api/v1/feedbacks/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(feedbackObj);

      expect(res.statusCode).toBe(404);
    });

    it('should return 404 if id is valid but no feedback exists with this id', async () => {
      const id = '66975f45558e7bd428f73a03';

      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };
      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user.id);

      const feedbackObj = {
        title: 'changing title',
      };

      const res = await request(app)
        .patch(`/api/v1/feedbacks/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(feedbackObj);

      expect(res.statusCode).toBe(404);
    });

    it('should return 401 if user is not logged in', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };

      const user = await createDummyUser(userObj);
      const feedback = await createDummyFeedback(user._id);

      const res = await request(app).patch(`/api/v1/feedbacks/${feedback.id}`);
      expect(res.statusCode).toBe(401);
    });

    it('should return 403 if user id is not equal to id of owner of feedback', async () => {
      const user1Obj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };

      const user2Obj = {
        fullName: 'second user',
        email: 'email@email.com',
        password: 'password123',
      };

      const user1 = await createDummyUser(user1Obj);
      const user2 = await createDummyUser(user2Obj);
      const feedback = await createDummyFeedback(user1._id);

      const token = generateJWTToken(user2._id);

      const res = await request(app)
        .patch(`/api/v1/feedbacks/${feedback.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(403);
    });

    it('should return 400 if input data is invalid', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };
      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user.id);

      const feedbackObj = {
        title: 'inv',
      };

      const res = await request(app)
        .patch(`/api/v1/feedbacks/${user.id}`)
        .send(feedbackObj)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
    });

    it('should return 400 if user wants to ', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };
      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user.id);

      const feedbackObj = {
        user: 'some text',
      };

      const res = await request(app)
        .patch(`/api/v1/feedbacks/${user.id}`)
        .send(feedbackObj)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('DELETE / delete feedback', () => {
    it('should return 404 if id is invalid', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };
      const user = await createDummyUser(userObj);
      user.verified = true;
      await user.save({ validateBeforeSave: false });
      const id = '66975fe1558e7';

      const token = generateJWTToken(user._id);

      const res = await request(app)
        .delete(`/api/v1/feedbacks/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });

    it('should return 404 if id is valid but docs does not exists', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };
      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user._id);
      const id = '667baf5286a240c08ae6d091';
      const res = await request(app)
        .delete(`/api/v1/feedbacks/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });

    it('should return 401 if token not set (user is not logged in)', async () => {
      const id = '66975fe1558e7bd428f73a0c';
      const token = '';
      const res = await request(app)
        .delete(`/api/v1/feedbacks/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.unauthorized).toBeTruthy();
      expect(res.statusCode).toBe(401);
    });

    it('should return 403 if user id is not equal to id of owner of feedback', async () => {
      const user1Obj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };

      const user2Obj = {
        fullName: 'second user',
        email: 'email@email.com',
        password: 'password123',
      };

      const user1 = await createDummyUser(user1Obj);
      const user2 = await createDummyUser(user2Obj);
      const feedback = await createDummyFeedback(user1._id);

      const token = generateJWTToken(user2._id);

      const res = await request(app)
        .delete(`/api/v1/feedbacks/${feedback.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(403);
    });

    it('should return 204 if everything is ok!', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };
      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user._id);
      const feedback = await createDummyFeedback(user._id);
      const res = await request(app)
        .delete(`/api/v1/feedbacks/${feedback.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(204);
    });
  });
});
