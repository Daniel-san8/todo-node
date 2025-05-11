import fastify from 'fastify';
import tasksRoutes from './tasks';
import fastifyCookie from '@fastify/cookie';
import usersRoutes from './users';

export const app = fastify();

app.register(fastifyCookie);

app.register(usersRoutes, {
  prefix: '/users',
});
app.register(tasksRoutes, {
  prefix: '/tasks',
});
