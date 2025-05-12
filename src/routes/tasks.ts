import { FastifyInstance } from 'fastify';
import { knex } from './database';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';

export default async function tasksRoutes(app: FastifyInstance) {
  app.get('/', async (req, reply) => {
    try {
      const decoded = await req.jwtVerify<{ author_id: string }>();

      const allTaks = await knex('tasks')
        .where('author_id', decoded.author_id)
        .select('*');

      reply.status(200).send({
        message: 'Todas transações listadas!!',
        tasks: allTaks,
      });
    } catch (error) {
      reply.status(401).send({
        error: 'Não autorizado',
      });
    }
  });

  app.post(
    '/',
    {
      onError: (_req, reply) => {
        reply.status(500).send({
          error: 'Erro ao criar tarefa',
        });
      },
    },
    async (req, reply) => {
      const bodyFormat = z.object({
        name: z.string(),
        description: z.string(),
      });

      const { name, description } = bodyFormat.parse(req.body);

      if (!name || !description) {
        return reply.status(400).send({
          error: 'Requisição inválida!',
        });
      }
      const decoded = await req.jwtVerify<{ author_id: string }>();
      if (!decoded.author_id)
        return reply.status(401).send({ error: 'Usuário não autorizado!' });
      const author_id_decoded = decoded.author_id;
      await knex('tasks').insert({
        id: randomUUID(),
        author_id: author_id_decoded,
        name,
        description,
        created_at: new Date().toISOString(),
      });

      reply.status(201).send({
        message: 'Tarefa criada com sucesso!',
      });
    }
  );
}
