declare module 'knex/types/tables' {
  export interface Tables {
    tasks: {
      id: string;
      name: string;
      created_at: string;
      description: string;
      author_id: string;
    };

    users: {
      author_name: string;
      password: string;
      author_id: string;
    };
  }
}
