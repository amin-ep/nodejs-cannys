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

config({ path: '.env' });

describe('users', () => {
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

  beforeAll(connect);
  afterAll(disconnect);
  afterEach(clearData);

  describe('GET / get all users', () => {
    it('should return 404 if url is wrong', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };

      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user._id);

      const res = await request(app)
        .get('/api/v1/usersssss')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });
    it('should return 403 if the user is not admin', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };

      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user._id);
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET / get user by id', () => {
    it('should return 401 if token not set (user is not logged in)', async () => {
      const id = '66975fe1558e7bd428f73a0c';
      const token = '';
      const res = await request(app)
        .get(`/api/v1/users/${id}`)
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
      user.role = 'admin';
      await user.save({ validateBeforeSave: false });
      const id = '66975fe1558e7';

      const token = generateJWTToken(user._id);

      const res = await request(app)
        .get(`/api/v1/users/${id}`)
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
      user.role = 'admin';
      await user.save({ validateBeforeSave: false });
      const token = generateJWTToken(user._id);
      const id = '667baf5286a240c08ae6d091';
      const res = await request(app)
        .get(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });
    it('should return 401 if token is invalid', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OTY0ODQ5M2Q2MjkyMjkyYTFkNDNlMiIsImlhdCI6MTcyMTEzNzA4NSwiZXhwIjoxNzIxOTE0Njg1fQ.VPdmJzGVpf_Gjq7tnYi1VffYLlkjtBoy_BK4xf_FXIc';

      const id = '66975fe1558e7bd428f73a0c';
      const res = await request(app)
        .get(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(401);
    });

    it('should return 403 if user role is not set to admin', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };
      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user._id);
      const id = '667baf5286a240c08ae6d091';
      const res = await request(app)
        .get(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(403);
    });
  });

  describe('PATCH / UdateMyPassword', () => {
    it('should return 400 if user wants to update his email too', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };
      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user._id);

      const body = {
        password: 'changedPass',
        currentPassword: 'Somepassword',
        email: 'some@email.io',
      };

      const res = await request(app)
        .patch('/api/v1/users/updateMyPassword')
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(res.statusCode).toBe(400);
    });
    it('should return 400 if current password and user password are not the same', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };
      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user._id);

      const body = {
        password: 'changedPass',
        currentPassword: 'wrongPass',
      };
      const res = await request(app)
        .patch('/api/v1/users/updateMyPassword')
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(res.statusCode).toBe(400);
    });

    it('should return 400 if password is invalid', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };
      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user._id);

      const body = {
        password: 'invpas',
        currentPassword: 'Somepassword',
      };
      const res = await request(app)
        .patch('/api/v1/users/updateMyPassword')
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(res.statusCode).toBe(400);
    });

    it('should return 401 if user is not logged in', async () => {
      const res = await request(app).patch(`/api/v1/users/updateMyPassword`);
      expect(res.statusCode).toBe(401);
    });

    it('should return 401 if token is invalid', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OTc1ZjQ1NTU4ZTdiZDQyOGY3M2EwMyIsImlhdCI6MTcyMTI5OTUyNiwiZXhwIjoxNzIxOTA0MzI2fQ.iWchjYgNkFy';

      const res = await request(app)
        .patch(`/api/v1/users/updateMyPassword`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(401);
    });
  });

  describe('PATCH / update Me', () => {
    // write part 1 FIXME
    it('should return 401 if user does not logged in', async () => {
      const res = await request(app).patch(`/api/v1/users/updateMe`);

      expect(res.statusCode).toBe(401);
    });

    it('should return 400 if user wants to update his password', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };
      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user._id);

      const res = await request(app)
        .patch('/api/v1/users/updateMe')
        .set('Authorization', `Bearer ${token}`)
        .send({ password: 'changepass' });

      expect(res.statusCode).toBe(400);
    });

    it('should return 400 in input data is invalid', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };
      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user._id);
      const res = await request(app)
        .patch('/api/v1/users/updateMe')
        .set('Authorization', `Bearer ${token}`)
        .send({ fullName: 'f' });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('DELETE / Delete Me', () => {
    it('should return 403 if user is not logged in', async () => {
      const res = await request(app).delete(`/api/v1/users/deleteMe`);
      expect(res.statusCode).toBe(401);
    });

    it('should delete current user and return 204', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };
      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user._id);
      const res = await request(app)
        .delete('/api/v1/users/deleteMe')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(204);
    });
  });

  describe('GET / get me', () => {
    it('should get current user based on authorization token', async () => {
      const userObj = {
        fullName: 'Test user',
        email: 'test@email.io',
        password: 'Somepassword',
      };

      const user = await createDummyUser(userObj);
      const token = generateJWTToken(user._id);

      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });
  });
});
