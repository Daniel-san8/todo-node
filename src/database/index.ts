import { Client } from "pg";

const client = new Client({
    password: "root",
    host: "localhost",
    user: "root",
    database: "TASKS",
    port: 5432
});


client.connect();

const query = async (query: string, values?: any[]) => {
    const { rows } = await client.query(query, values);
    return rows;
}

export default query;