import { beforeAll, afterAll, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../routes/app';
import { execSync } from 'node:child_process';

describe.skip('check to routes in tasks', () => {
  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback');
    execSync('npm run knex migrate:latest');
  });

  it('to returning all tasks', async () => {
    const registerResponse = await request(app.server)
      .post('/users/register')
      .send({
        author_name: 'Usuário de test',
        password: 'Senha@123',
      })
      .expect(201);

    const cookie = registerResponse.get('Set-Cookie') || [];

    const allTasks = await request(app.server)
      .get('/tasks')
      .set('Cookie', cookie)
      .expect(200);

    expect(allTasks.body).toHaveProperty('tasks');
    expect(Array.isArray(allTasks.body.tasks)).toBe(true);
  });

  it('he must create task off date', async () => {
    const registerResponse = await request(app.server)
      .post('/users/register')
      .send({
        author_name: 'Usuário de test',
        password: 'Senha@123',
      })
      .expect(201);

    const cookie = registerResponse.get('Set-Cookie') || [];

    await request(app.server)
      .post('/tasks')
      .send({
        name: 'Usuário de test',
        description: 'Testando a data com teste',
      })
      .set('Cookie', cookie)
      .expect(201);
  });

  it('he must create task on date', async () => {
    const registerResponse = await request(app.server)
      .post('/users/register')
      .send({
        author_name: 'Usuário de test',
        password: 'Senha@123',
      })
      .expect(201);

    const cookie = registerResponse.get('Set-Cookie') || [];

    await request(app.server)
      .post('/tasks')
      .send({
        name: 'Usuário de test',
        description: 'Testando a data com teste',
        date_finish: '2025-05-13T23:19:00Z',
      })
      .set('Cookie', cookie)
      .expect(201);
  });
});
