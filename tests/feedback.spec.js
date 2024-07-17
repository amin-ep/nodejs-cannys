/* eslint-disable no-undef */
import request from 'supertest';
import app from '../app.js';
import { connect, disconnect } from '../helpers/mongodb.memory.test.helper.js';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config({ path: '.env' });
jest.mock('jsonwebtoken');
describe('feedbacks', () => {
  // let token;

  // beforeAll(() => {
  //   token = jwt.sign({ id: '66975f45558e7bd428f73a03' }, JWT_SECRET, {
  //     expiresIn: '7d',
  //   });
  // });
  beforeAll(connect);
  afterAll(disconnect);

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
      const id = '66975fe1558e7';
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OTc1ZjQ1NTU4ZTdiZDQyOGY3M2EwMyIsImlhdCI6MTcyMTIxNzk4NiwiZXhwIjoxNzIxODIyNzg2fQ.elWXNu1EODHNxqLV-GxMC3H7APphlUZr0S2341pMN8Q';
      const res = await request(app)
        .get(`/api/v1/feedbacks/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST / create feedback', () => {
    it('should return 401 if token not set (user is not logged in)', async () => {
      const id = '66975fe1558e7bd428f73a0c';
      const token = '';
      const res = await request(app)
        .get(`/api/v1/feedbacks/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.unauthorized).toBeTruthy();
      expect(res.statusCode).toBe(401);
    });

    // it('should create data if everything is ok', async () => {
    //   const bodyObj = {
    //     user: '66975f45558e7bd428f73a03',
    //     title: 'DUMMY_OBJECT',
    //   };

    //   const token =
    //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OTc1ZjQ1NTU4ZTdiZDQyOGY3M2E';

    //   const res = await request(app)
    //     .post('/api/v1/feedbacks')
    //     .set('Authorization', `Bearer ${token}`)
    //     .send(bodyObj);

    //   expect(res.statusCode).toBe(404);
    // });
  });

  describe('PATCH / update feedback', () => {
    it('should return 404 if id is wrong and feedback does not exists', () => {});
  });

  describe('DELETE / delete feedback', () => {});
});
