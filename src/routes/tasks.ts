import { FastifyInstance } from 'fastify';

export default async function tasksRoutes(app: FastifyInstance) {
  app.get('/', async (req, reply) => {
    reply.status(200).send({
      message: 'Tudo correto!!',
    });
  });
}
