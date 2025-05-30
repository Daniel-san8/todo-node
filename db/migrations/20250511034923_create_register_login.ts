import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.string('author_name').notNullable();
    table.text('password').notNullable();
    table.uuid('author_id').primary();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
