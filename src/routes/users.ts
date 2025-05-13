import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { knex } from './database';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import verifyTokenJwt from '../middleware/verify-token-jwt';

export default async function usersRoutes(app: FastifyInstance) {
  app.post('/login', {
    schema: {
      tags: ['Usuários'],
      summary: 'Login de usuário',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          password: { type: 'string' },
        },
        required: ['name', 'password'],
      },
      response: {
        200: {
          description: 'Login realizado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        401: {
          description: 'Erro de autenticação',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    handler: async (req, reply) => {
      try {
        const schemaBody = z.object({
          name: z.string(),
          password: z.string(),
        });
        const { name, password } = schemaBody.parse(req.body);

        const searchUser = await knex('users')
          .where({ author_name: name })
          .first();

        if (!searchUser) throw new Error('Login ou senha inválidos');

        const passwordHash = await bcrypt.compare(
          password,
          searchUser.password
        );
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
          .send({ message: 'Login realizado' });
      } catch (error) {
        reply.status(401).send({
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
    },
  });

  app.get(
    '/',
    {
      preHandler: [verifyTokenJwt],
      schema: {
        tags: ['Usuários'],
        summary: 'Listar usuários',
        response: {
          200: {
            description: 'Todos os usuários retornados',
            type: 'object',
            properties: {
              message: { type: 'string' },
              users: { type: 'array', items: { type: 'object' } },
            },
          },
        },
      },
    },
    async (_req, reply) => {
      const users = await knex('users').select('*');

      reply.status(200).send({
        message: 'Todos os usuários retornados',
        users,
      });
    }
  );

  app.post('/register', {
    schema: {
      tags: ['Usuários'],
      summary: 'Registrar novo usuário',
      body: {
        type: 'object',
        properties: {
          author_name: { type: 'string', maxLength: 45 },
          password: { type: 'string', minLength: 8 },
        },
        required: ['author_name', 'password'],
      },
      response: {
        201: {
          description: 'Usuário criado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        400: {
          description: 'Erro na requisição',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    handler: async (req, reply) => {
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
    },
  });
}
