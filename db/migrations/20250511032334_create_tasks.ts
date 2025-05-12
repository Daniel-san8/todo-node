import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tasks', (table) => {
    table.uuid('id').primary().index();
    table.string('name').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.text('description').notNullable();
    table.dateTime('date_finish');
    table.enum('status', ['PENDING', 'FINISH']);
    table
      .uuid('author_id')
      .notNullable()
      .references('author_id')
      .inTable('users')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tasks');
}
