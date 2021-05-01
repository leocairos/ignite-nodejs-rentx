import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Create Category Controller', () => {
  beforeAll(async () => {
    connection = await createConnection('localhost', true);

    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", driver_license, created_at)
    VALUES('${id}', 'admin', 'admin@mail.com', '${password}', true, '123456789', 'now()')`,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new category', async () => {
    const responseToken = await request(app)
      .post('/sessions')
      .send({ email: 'admin@mail.com', password: 'admin' });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Category SuperTest',
        description: 'Category Created by Supertest',
      })
      .set({
        Authorization: `Bear ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it('should NOT be able to create a new category with name exists', async () => {
    const responseToken = await request(app)
      .post('/sessions')
      .send({ email: 'admin@mail.com', password: 'admin' });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Category SuperTest',
        description: 'Category Created by Supertest',
      })
      .set({
        Authorization: `Bear ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
