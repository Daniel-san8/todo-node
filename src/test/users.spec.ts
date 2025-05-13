import { beforeAll, afterAll, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../routes/app';
import { execSync } from 'node:child_process';

describe('will check all user routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:rollback');
    execSync('npm run knex migrate:latest');
  });

  it('check if the post is correct in register', async () => {
    await request(app.server)
      .post('/users/register')
      .send({
        author_name: 'Usuário de test',
        password: 'Senha@123',
      })
      .expect(201);
  });

  it('check login after register', async () => {
    await request(app.server).post('/users/register').send({
      author_name: 'Usuário de test',
      password: 'Senha@123',
    });

    await request(app.server)
      .post('/users/login')
      .send({
        name: 'Usuário de test',
        password: 'Senha@123',
      })
      .expect(200);
  });

  it('check all users in returning all users', async () => {
    await request(app.server).post('/users/register').send({
      author_name: 'Usuário de test',
      password: 'Senha@123',
    });

    const loginResponse = await request(app.server)
      .post('/users/login')
      .send({
        name: 'Usuário de test',
        password: 'Senha@123',
      })
      .expect(200);

    const cookieUser = loginResponse.get('Set-Cookie');

    const users = await request(app.server)
      .get('/users')
      .set('Cookie', cookieUser ? cookieUser : []);

    expect(users.body).toHaveProperty('users');
    expect(Array.isArray(users.body.users)).toBe(true);
  });
});
