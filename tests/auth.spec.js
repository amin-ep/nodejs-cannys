/* eslint-disable no-undef */
import request from 'supertest';
import app from '../app.js';
import { connect, disconnect } from '../helpers/mongodb.memory.test.helper.js';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config({ path: '.env' });
jest.setTimeout(10000);
describe('authentication', () => {
  beforeAll(connect);
  afterAll(disconnect);

  let token;
  beforeAll(() => {
    token = jwt.sign(
      { id: '66975f45558e7bd428f73a03' },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      },
    );
  });

  describe('/POST register', () => {
    it('should return 403 if the user exists and verified', async () => {
      const bodyObj = {
        fullName: 'AminEbadi',
        email: 'amincode24@gmail.com',
        password: 'somepassword',
      };

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(bodyObj);

      console.log(res.error);
      expect(res.statusCode).toBe(403);
    });
    it('should check user exists and send email if it is not verified', async () => {
      const bodyObj = {
        fullName: 'AminEbadi',
        email: 'amincode24@gmail.com',
        password: 'somepassword',
      };

      const mockEmailVerificationKey = jest.fn();
      const key = mockEmailVerificationKey(
        () => 'c916cd3c-52c6-40af-9628-2fe388a4be84',
      );
      const emailOptions = {
        from: "Canny's clone <info@aminebadi.ir>",
        to: bodyObj.email,
        subject: key,
        html: '<p>To confirm your email address please click <a href="http://localhost:3000/api/v1/verifyEmail/${key}"></a></p>',
      };
      const mockSendEmail = jest.fn(emailOptions);

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(bodyObj);

      expect(res.statusCode).toBe(200);
      expect(mockEmailVerificationKey).toHaveBeenCalled();
      expect(mockSendEmail).toHaveBeenCalledWith(emailOptions);
    });

    it('should create a new account if there is no user with this id and send email to that email', async () => {
      const bodyObj = {
        fullName: 'AminEbadi',
        email: 'aminepm82@gmail.com',
        password: 'somepassword',
      };
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(bodyObj);
    });
  });

  describe('login', () => {
    it.only('should return 400 if password is invalid', async () => {
      const bodyObj = {
        email: 'amincode24@gmail.com',
        password: '123456789',
      };
      const res = await request(app).post('/api/v1/auth/login').send(bodyObj);
      expect(res.statusCode).toBe(400);
    });

    it.only('should throw error if account is not verified', async () => {
      const bodyObj = {
        email: 'notverified@email.io',
        password: 'not verified',
      };

      const res = await request(app).post('/api/v1/auth/login').send(bodyObj);
      expect(res.statusCode);
    });
  });
});
