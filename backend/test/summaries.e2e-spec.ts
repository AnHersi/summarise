import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import * as request from 'supertest';
import { getModelToken } from '@nestjs/mongoose';
import { AppModule } from '../src/app.module';

describe('SummariesController (e2e)', () => {
  let app: INestApplication;

  const mockSummaryModel = {};

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    })
      .overrideProvider(getModelToken)
      .useValue(mockSummaryModel)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/summary/all (GET)', () => {
    return request(app.getHttpServer())
      .get('/summary/all')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('_id');
        expect(res.body[0]).toHaveProperty('highlight');
        expect(res.body[0]).toHaveProperty('data');
        expect(res.body[0]).toHaveProperty('__v');
      });
  });

  it('/summary (POST)', () => {
    return request(app.getHttpServer())
      .post('/summary')
      .send({
        message: 'Selected text',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('summary');
      });
  });

  it('/summary/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/summary/64415c1deb07e01719ebd2ea')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('acknowledged');
        expect(res.body).toHaveProperty('deletedCount');
      });
  });
});
