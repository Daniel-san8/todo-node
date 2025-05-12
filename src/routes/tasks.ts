import { FastifyInstance } from 'fastify';
import { knex } from './database';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import cron from 'node-cron';

export default async function tasksRoutes(app: FastifyInstance) {
  app.get('/', async (req, reply) => {
    try {
      const decoded = await req.jwtVerify<{ author_id: string }>();

      const allTaks = await knex('tasks')
        .where('author_id', decoded.author_id)
        .select('*');

      reply.status(200).send({
        message: 'Todas tarefas listadas!!',
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
        date_finish: z
          .preprocess(
            (val) => (val ? new Date(val as string) : undefined),
            z.date()
          )
          .optional(),
      });

      const { name, description, date_finish } = bodyFormat.parse(req.body);

      if (!name || !description) {
        return reply.status(400).send({
          error: 'Requisição inválida!',
        });
      }

      const decoded = await req.jwtVerify<{ author_id: string }>();
      if (!decoded.author_id)
        return reply.status(401).send({ error: 'Usuário não autorizado!' });

      const author_id_decoded = decoded.author_id;

      let date_finish_trunc: string | undefined = undefined;
      if (date_finish) {
        const d = new Date(date_finish);
        d.setSeconds(0);
        d.setMilliseconds(0);
        date_finish_trunc = d.toISOString().slice(0, 16);

        const cronDate = {
          minute: d.getMinutes(),
          hour: d.getHours(),
          dayMonth: d.getDate(),
          month: d.getMonth() + 1,
          dayWeek: d.getDay(),
        };

        const tupleDateCron = `${cronDate.minute} ${cronDate.hour} ${cronDate.dayMonth} ${cronDate.month} ${cronDate.dayWeek}`;

        cron.schedule(tupleDateCron, async () => {
          const targetTime = new Date(date_finish).toISOString().slice(0, 16);

          await knex('tasks')
            .where({ author_id: author_id_decoded, status: 'PENDING' })
            .andWhereRaw("strftime('%Y-%m-%dT%H:%M', date_finish) = ?", [
              targetTime,
            ])
            .update('status', 'FINISH');
        });
        console.log('cron iniciado');
      }

      await knex('tasks')
        .insert({
          id: randomUUID(),
          author_id: author_id_decoded,
          name,
          description,
          status: date_finish_trunc ? 'PENDING' : null,
          date_finish: date_finish_trunc,
          created_at: new Date().toISOString(),
        })
        .returning('*');
      reply.status(201).send({
        message: 'Tarefa criada com sucesso!',
      });
    }
  );
}
