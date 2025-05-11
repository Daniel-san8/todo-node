import { Knex, knex as setupKnex } from 'knex';
import { env } from '../env';

export const configKnex: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn: any, done: any) => {
      conn.run('PRAGMA foreign_keys = ON', done); // 🔥 isso é necessário!
    },
  },
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
};

export const knex = setupKnex(configKnex);
