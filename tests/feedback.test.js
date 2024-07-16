/* eslint-disable no-undef */
import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('feedbacks', () => {
  let mongoServer;
  let server;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    server = app.listen(8080);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    server.close();
  });

  describe('get all feedbacks', () => {
    it('should return 404 if url is wrong', async () => {
      const res = await request(app).get('/api/v1/feedbackss');
      expect(res.statusCode).toBe(404);
    });
    it('should return 200 if url is correct', async () => {
      const res = await request(app).get('/api/v1/feedbacks');
      expect(res.statusCode).toBe(200);
    });
  });

  describe('get feedback by id', () => {
    it('should return 404 if id is invalid', async () => {
      const id = 'sdfsdfsfdsdf';

      const res = await request(app).get(`/api/v1/feedbacks/${id}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('create feedback', () => {});

  describe('update feedback', () => {});

  describe('delete feedback', () => {});
});
