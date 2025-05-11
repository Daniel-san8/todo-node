import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tasks', (table) => {
    table.uuid('id').primary().index();
    table.string('name').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.text('description').notNullable();
    table.uuid('author_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tasks');
}
