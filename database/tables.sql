-- Development script
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS quizzes;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS tokens;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username varchar(255) UNIQUE NOT NULL,
    password varchar(60) NOT NULL,
    role varchar(10) NOT NULL
);

CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    title varchar(255) NOT NULL,
    description text,
    user_id INT REFERENCES users(id)
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    text text NOT NULL,
    quiz_id INT REFERENCES quizzes(id)
);

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    text text NOT NULL,
    is_correct BOOLEAN,
    question_id INT REFERENCES questions(id)
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title varchar(255) NOT NULL,
    content text,
    user_id INT REFERENCES users(id)
);

-- Create tokens table
CREATE TABLE tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id INT REFERENCES users(id),
  token_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expiration_time TIMESTAMP WITH TIME ZONE NOT NULL
);