-- Development script
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS quizzes;
DROP TABLE IF EXISTS notes;

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username varchar(255) UNIQUE NOT NULL,
    password varchar(60) NOT NULL,
    role varchar(10) NOT NULL
);

CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    title varchar(255) NOT NULL,
    description text,
    user_id uuid REFERENCES users(id)
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title varchar(255) NOT NULL,
    content text,
    user_id uuid REFERENCES users(id)
);
