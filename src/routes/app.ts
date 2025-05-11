import fastify from 'fastify';
import tasksRoutes from './tasks';
import fastifyCookie from '@fastify/cookie';
import usersRoutes from './users';
import fastifyJwt from 'fastify-jwt';

export const app = fastify();

app.register(fastifyCookie);
app.register(fastifyJwt, {
  secret: 'chavejwt',
});

app.register(usersRoutes, {
  prefix: '/users',
});
app.register(tasksRoutes, {
  prefix: '/tasks',
});
