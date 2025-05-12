import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { knex } from './database';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';

export default async function usersRoutes(app: FastifyInstance) {
  app.setErrorHandler((_error, _req, reply) => {
    reply.status(500).send({
      error: 'ERRO NA API',
    });
  });

  app.post('/login', async (req, reply) => {
    try {
      const schemaBody = z.object({
        name: z.string(),
        password: z.string(),
      });
      const { name, password } = schemaBody.parse(req.body);

      if (!name || !password) {
        throw new Error('Usuário ou senha não preenchidos');
      }

      const searchUser = await knex('users')
        .where({
          author_name: name,
        })
        .first();

      if (!searchUser) throw new Error('Login ou senha inválidos');

      const passwordHash = await bcrypt.compare(password, searchUser.password);

      if (!passwordHash) throw new Error('Senha incorreta!!');

      const token = app.jwt.sign(
        { author_id: searchUser.author_id },
        { expiresIn: '72h' }
      );

      reply
        .setCookie('token', token, {
          secure: false,
          sameSite: 'strict',
          httpOnly: true,
          path: '/',
        })
        .status(200)
        .send({
          message: 'Login realizado',
        });
    } catch (error) {
      reply.status(401).send({
        error: error instanceof Error && error.message,
      });
    }
  });

  app.get('/', async (_req, reply) => {
    const users = await knex('users').select('*');

    reply.status(200).send({
      message: 'Todos os usuários retornados',
      users,
    });
  });

  app.post('/register', async (req, reply) => {
    const schemaBodyUsers = z.object({
      author_name: z.string().max(45),
      password: z
        .string()
        .min(8)
        .regex(/[a-z]/)
        .regex(/[A-Z]/)
        .regex(/[^a-zA-Z0-9]/),
    });

    const { author_name, password } = schemaBodyUsers.parse(req.body);

    if (!author_name || !password) {
      return reply.status(400).send({
        error: 'Campos inválidos',
      });
    }

    const existingUser = await knex('users').where({ author_name }).first();
    if (existingUser) {
      return reply.status(400).send({
        error: 'Usuário já existe',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [newUser] = await knex('users')
      .insert({
        author_name,
        password: passwordHash,
        author_id: randomUUID(),
      })
      .returning('*');

    const token = app.jwt.sign(
      { author_id: newUser.author_id },
      { expiresIn: '72h' }
    );

    reply
      .setCookie('token', token, {
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      })
      .status(201)
      .send({
        message: 'Usuário criado com sucesso!',
      });
  });
}
