import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import knex from 'knex';
import { z } from 'zod';

export default async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const schemaBodyUsers = z.object({
      author: z.string().max(45),
      password: z
        .string()
        .min(8)
        .regex(/[a-z]/)
        .regex(/[A-Z]/)
        .regex(/[^a-zA-Z0-9]/),
    });

    const { author, password } = schemaBodyUsers.parse(schemaBodyUsers);

    if (!author || !password) {
      return reply.status(400).send({
        error: 'Campos inválidos',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await knex('users').insert({
      author,
      password,
    });
  });
}
