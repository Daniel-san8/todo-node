import fastify from 'fastify';
import tasksRoutes from './tasks';
import fastifyCookie from '@fastify/cookie';
import usersRoutes from './users';
import fastifyJwt from 'fastify-jwt';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

export const app = fastify();

app.register(swagger, {
  swagger: {
    info: {
      title: 'API Tasks',
      description: 'Documentação da API de tarefas',
      version: '1.0.0',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
});
app.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
});

app.register(fastifyCookie);
app.register(fastifyJwt, {
  secret: 'chavejwt',
  cookie: {
    cookieName: 'token',
    signed: false,
  },
});

app.register(usersRoutes, {
  prefix: '/users',
});
app.register(tasksRoutes, {
  prefix: '/tasks',
});
