CREATE DATABASE TASKS;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS tasks (
    id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    title VARCHAR NOT NULL,
    description VARCHAR NOT NULL
);