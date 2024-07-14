/* eslint-disable no-undef */
import request from 'supertest';
import app from '../app.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.mock('../app.js');
jest.mock('../models/Feedback.js');

describe('feedbacks', () => {
  let mongodb;
  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
    const uri = mongodb.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongodb.stop();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key of collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  });
  describe('get all feedbacks', () => {
    it('should return 200 if the path is correct', async () => {
      const actual = await request(app).get('/api/v1/feedbacks');
      expect(actual.status).toBe(200);
    });

    it('should return 400 if the path is wrong', async () => {
      const actual = await request(app).get('/api/v1/wrongPath');
      expect(actual.status).toBe(404);
    });
  });

  describe('get feedback by id', () => {});

  describe('create feedback', () => {});

  describe('update feedback', () => {});

  describe('delete feedback', () => {});
});
