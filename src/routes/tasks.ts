import { FastifyInstance } from 'fastify';
import knex from 'knex';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';

export default async function tasksRoutes(app: FastifyInstance) {
  app.get('/', async (req, reply) => {
    reply.status(200).send({
      message: 'Tudo correto!!',
    });
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
      const author_id = req.cookies.author_id;

      if (!author_id) {
        return reply.status(401).send({
          error: 'Usuário não autorizado',
        });
      }

      if (!name || !description) {
        return reply.status(400).send({
          error: 'Requisição inválida!',
        });
      }

      await knex('tasks').insert({
        id: randomUUID(),
        author_id,
        name,
        description,
        created_at: new Date(),
      });

      reply.status(201).send({
        message: 'Tarefa criada com sucesso!',
      });
    }
  );
}
