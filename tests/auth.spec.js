/* eslint-disable no-undef */
import request from 'supertest';
import app from '../app.js';
import {
  connect,
  disconnect,
  clearData,
} from '../helpers/mongodb.memory.test.helper.js';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import User from '../models/User.js';
import sinon from 'sinon';
config({ path: '.env' });
jest.mock('nodemailer');
describe('Authentication', () => {
  // const generateJWTToken = id => {
  //   const token = jwt.sign({ id }, process.env.JWT_SECRET, {
  //     expiresIn: process.env.JWT_EXPIRES,
  //   });
  //   return token;
  // };
  const createVerifiedUser = async body => {
    const user = await User.create(body);
    user.verified = true;
    await user.save({ validateBeforeSave: false });
    return user;
  };

  const createUnverifiedUser = async body => {
    const user = await User.create(body);
    return user;
  };

  beforeAll(connect);
  afterAll(disconnect);
  afterEach(clearData);

  // describe('POST/ Register', () => {
  //   it('should send email if user exists and not verified', async () => {
  //     const userObj = {
  //       fullName: 'full name',
  //       email: 'test@email.io',
  //       password: 'somepassword',
  //     };

  //     const user = await createUnverifiedUser(userObj);
  //     const key = user.generateVerifyKey();
  //     const link = `http://localhost:3000/api/v1/verifyEmail/${key}`;
  //     const html = `
  //       <p>To confirm your email address please click <a href="${link}"></a>
  //     `;
  //     const message = `An email sent to ${user.email}. Please verify your email!`;

  //     // const sendEmail = await sinon.fake();
  //     const res = await request(app)
  //       .post('/api/v1/auth/register')
  //       .send(userObj);
  //     console.log(res.body);
  //     expect(res.statusCode).toBe(200);
  //   });
  // });

  describe('POST / Login', () => {
    it('should return 400 if user does not exists (email is incorrect)', async () => {
      const userObj = {
        email: 'test@email.io',
        password: 'somepassword',
      };

      const res = await request(app).post('/api/v1/auth/login').send(userObj);

      expect(res.statusCode).toBe(400);
    });

    it('should return 400 if password is incorrect', async () => {
      const userObj = {
        fullName: 'full name',
        email: 'test@email.io',
        password: 'somepassword',
      };

      const loginBody = {
        email: 'test@email.io',
        password: 'incorrectPass',
      };

      await createVerifiedUser(userObj);
      const res = await request(app).post('/api/v1/auth/login').send(loginBody);

      expect(res.statusCode).toBe(400);
    });

    it('should login user and return 200', async () => {
      const userObj = {
        fullName: 'full name',
        email: 'test@email.io',
        password: 'somepassword',
      };
      await createVerifiedUser(userObj);
      const loginBody = {
        email: 'test@email.io',
        password: 'somepassword',
      };

      const res = await request(app).post('/api/v1/auth/login').send(loginBody);
      console.log(res.body);

      expect(res.statusCode).toBe(200);
    });

    it('should return 400 if data is invalid', async () => {
      const loginBody = {
        email: 'test@',
        password: 'somePassword',
      };

      const userObj = {
        fullName: 'full name',
        email: 'test@email.io',
        password: 'somepassword',
      };
      await createVerifiedUser(userObj);
      const res = await request(app).post('/api/v1/auth/login').send(loginBody);
      expect(res.statusCode).toBe(400);
    });

    it('should return 401 if user is not verified', async () => {
      const loginBody = {
        email: 'test@email.io',
        password: 'somepassword',
      };

      const userObj = {
        fullName: 'full name',
        email: 'test@email.io',
        password: 'somepassword',
      };
      await createUnverifiedUser(userObj);
      const res = await request(app).post('/api/v1/auth/login').send(loginBody);
      expect(res.statusCode).toBe(401);
    });
  });
});
