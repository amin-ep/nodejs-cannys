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

config({ path: '.env' });

describe('feedbacks', () => {
  const generateJWTToken = id => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIERES,
    });
    return token;
  };
  const createDummyUser = async body => {
    const user = await User.create(body);
    user.verified = true;
    await user.save({ validateBeforeSave: false });
    return user;
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
    it.skip('should return 401 if token is invalid', async () => {
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
      console.log(res.body);
      expect(res.body.status).toBe('fail');
      expect(res.statusCode).toBe(400);
    });
  });

  describe('PATCH / update feedback', () => {
    // it.only('should return 404 if id is invalid', async () => {
    //   const userObj = {
    //     fullName: 'Test user',
    //     email: 'test@email.io',
    //     password: 'Somepassword',
    //   };
    //   const user = await createDummyUser(userObj);
    //   user.verified = true;
    //   await user.save({ validateBeforeSave: false });
    //   const token = generateJWTToken(user._id);
    //   const feedbacksObj = {
    //     title: 'title',
    //   };
    //   const id = '66975fe1558e7';
    //   const res = await request(app)
    //     .patch(`/api/v1/feedbacks/${id}`)
    //     .send(feedbacksObj)
    //     .set('Authorization', `Bearer ${token}`);
    //   expect(res.statusCode).toBe(404);
    // });
  });

  describe('DELETE / delete feedback', () => {
    // it.only('should return 404 if id is invalid', async () => {
    //   const userObj = {
    //     fullName: 'Test user',
    //     email: 'test@email.io',
    //     password: 'Somepassword',
    //   };
    //   const user = await createDummyUser(userObj);
    //   user.verified = true;
    //   await user.save({ validateBeforeSave: false });
    //   const token = generateJWTToken(user._id);
    //   const id = 'invalidId';
    //   const res = await request(app)
    //     .delete(`/api/v1/feedbacks/${id}`)
    //     .set('Authorization', `Bearer ${token}`);
    //   expect(res.statusCode).toBe(404);
    // });
  });
});
