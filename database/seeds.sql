-- Insert some sample users
INSERT INTO users (username, password, role) VALUES
    ('user1', 'password1', 'student'),
    ('user2', 'password2', 'teacher'),
    ('user3', 'password3', 'student');

-- Insert some sample quizzes for user1
INSERT INTO quizzes (title, description, user_id) VALUES
    ('Math Quiz 1', 'A quiz on basic arithmetic.', 1),
    ('English Quiz 1', 'A quiz on grammar and vocabulary.', 1),
    ('Science Quiz 1', 'A quiz on the basics of physics and chemistry.', 1);

-- Insert some sample quizzes for user2
INSERT INTO quizzes (title, description, user_id) VALUES
    ('History Quiz 1', 'A quiz on world history.', 2),
    ('Geography Quiz 1', 'A quiz on the world continents and oceans.', 2);

-- Insert some sample notes for user3
INSERT INTO notes (title, content, user_id) VALUES
    ('Math Notes', 'My notes on algebra and geometry.', 3),
    ('Science Notes', 'My notes on biology and earth science.', 3),
    ('English Notes', 'My notes on Shakespeare and modern literature.', 3);

-- Insert some sample tokens for user 1
INSERT INTO tokens (user_id, token_hash, expiration_time) VALUES
    (1, 'hash1', NOW() + INTERVAL '1 day'),
    (1, 'hash2', NOW() + INTERVAL '2 days');

-- Insert some sample tokens for user 2
INSERT INTO tokens (user_id, token_hash, expiration_time) VALUES
    (2, 'hash3', NOW() + INTERVAL '3 days');

-- Insert some sample tokens for user 3
INSERT INTO tokens (user_id, token_hash, expiration_time) VALUES
    (3, 'hash4', NOW() + INTERVAL '4 days'),
    (3, 'hash5', NOW() + INTERVAL '5 days');
