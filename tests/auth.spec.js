/* eslint-disable no-undef */
import request from 'supertest';
import app from '../app.js';
import {
  connect,
  disconnect,
  clearData,
} from '../helpers/mongodb.memory.test.helper.js';
import { config } from 'dotenv';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import sendMail from '../email/email.js';

config({ path: '.env' });
jest.mock('nodemailer');

describe('Authentication', () => {
  const createVerifiedUser = async body => {
    const user = await User.create(body);
    user.verified = true;
    await user.save({ validateBeforeSave: false });
    return user;
  };

  const createUnverifiedUser = async body => {
    const user = await User.create(body);
    user.generateVerifyKey();
    await user.save({ validateBeforeSave: false });
    return user;
  };

  beforeAll(connect);
  afterAll(disconnect);
  afterEach(clearData);

  describe('POST / register', () => {
    it.only('should return 200 and send email if user exists and not veridied', async () => {
      const userObj = {
        fullName: 'full name',
        email: 'test@email.io',
        password: 'somepassword',
      };

      const sendEmailMock = jest
        .fn()
        .mockResolvedValue({ accepted: [userObj.email] });

      nodemailer.createTransport.mockReturnValue({
        sendMail: sendEmailMock,
      });

      const user = await createUnverifiedUser(userObj);
      const key = user.generateVerifyKey();
      const link = `http://example.com/verify?key=${key}`;
      const html = `
      <p>To confirm your email address please click <a href="${link}">${link}</a></p>
     `;
      const options = {
        email: user.email,
        subject: key,
        message: 'This is a test mail',
        html,
      };

      await sendMail(options);

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userObj);
      expect(res.statusCode).toBe(200);

      expect(sendEmailMock).toHaveBeenCalledWith({
        from: 'Cannys Clone <info@aminebadi.ir>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
      });
    });

    it.only('should return 201 and create user if user does not exists and send email', async () => {
      const userObj = {
        fullName: 'full name',
        email: 'test@email.io',
        password: 'somepassword',
      };

      const sendEmailMock = jest
        .fn()
        .mockResolvedValue({ accepted: [userObj.email] });

      nodemailer.createTransport.mockReturnValue({
        sendMail: sendEmailMock,
      });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userObj);

      console.log('register', res.body);

      expect(res.statusCode).toBe(201);
    });

    it.only('should return 403 if user exists and verified', async () => {
      const userObj = {
        fullName: 'full name',
        email: 'test@email.io',
        password: 'somepassword',
      };

      await createVerifiedUser(userObj);

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userObj);

      expect(res.statusCode).toBe(403);
    });
  });

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

  describe('POST / Verify Email', () => {
    it('should return 404 if key is invalid and user does not found', async () => {
      const key = '1d7d60e1-33cb-41d8-ab82-e20556ac7e4f';

      const res = await request(app).post(`/api/v1/auth/verifyEmail/${key}`);

      expect(res.statusCode).toBe(404);
    });

    // it.only('should return 200 and verify user if user key is valid', async () => {
    //   const userObj = {
    //     fullName: 'full name',
    //     email: 'test@email.io',
    //     password: 'somepassword',
    //   };

    //   const user = await createUnverifiedUser(userObj);

    //   const res = await request(app).patch(
    //     `/api/v1/auth/verifyEmail/${user.emailVerifyCode}`,
    //   );
    //   expect(res.statusCode).toBe(200);
    // });
  });

  describe('POST / Forget Password', () => {
    it.only('should return 400 if input email is invalid and user does not exists', async () => {
      const reqBody = {
        email: 'invalid@email.io',
      };

      const res = await request(app)
        .post('/api/v1/auth/forgetPassword')
        .send(reqBody);

      expect(res.statusCode).toBe(404);
    });

    it.only('should return 400 if email is invalid email', async () => {
      const reqBody = {
        email: 'test@',
      };

      const res = await request(app)
        .post('/api/v1/auth/forgetPassword')
        .send(reqBody);

      expect(res.statusCode).toBe(400);
    });

    it.only('should return 200 if email is valid and send code te email', async () => {
      const userObj = {
        fullName: 'full name',
        email: 'test@email.io',
        password: 'somepassword',
      };

      const user = await createUnverifiedUser(userObj);
      const token = user.generatePasswordResetToken();
      await user.save({ validateBeforeSave: false });

      const reqBody = {
        email: 'test@email.io',
      };

      const sendEmailMock = jest
        .fn()
        .mockResolvedValue({ accepted: [userObj.email] });

      nodemailer.createTransport.mockReturnValue({
        sendMail: sendEmailMock,
      });
      const link = `http://example.com/verify?key=${token}`;
      const html = `
      <p>To confirm your email address please click <a href="${link}">${link}</a></p>
     `;

      const options = {
        email: user.email,
        subject: token,
        message: 'This is a test mail',
        html,
      };

      await sendMail(options);

      const res = await request(app)
        .post('/api/v1/auth/forgetPassword')
        .send(reqBody);
      expect(res.statusCode).toBe(200);
      expect(sendEmailMock).toHaveBeenCalledWith({
        from: 'Cannys Clone <info@aminebadi.ir>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
      });
    });
  });
});
