declare module 'knex/types/tables' {
  export interface Tables {
    tasks: {
      id: string;
      name: string;
      created_at: string;
      description: string;
      author_id: string;
    };
  }
}
