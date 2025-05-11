import fastify from 'fastify';
import tasksRoutes from './tasks';
import fastifyCookie from '@fastify/cookie';

export const app = fastify();

app.register(fastifyCookie);

app.register(tasksRoutes, {
  prefix: '/tasks',
});
