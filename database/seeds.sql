-- Insert some sample users
INSERT INTO users (username, password, role) VALUES
    ('john_doe', crypt('mysecretpassword', gen_salt('bf')), 'student'),
    ('jane_smith', crypt('myp@ssw0rd', gen_salt('bf')), 'teacher'),
    ('bob_jones', crypt('password123', gen_salt('bf')), 'student');

-- Insert some sample quizzes for user 'john_doe'
INSERT INTO quizzes (title, description, user_id) VALUES
    ('Math Quiz 1', 'A quiz on basic arithmetic.', '123e4567-e89b-12d3-a456-426655440000'),
    ('English Quiz 1', 'A quiz on grammar and vocabulary.', '123e4567-e89b-12d3-a456-426655440000'),
    ('Science Quiz 1', 'A quiz on the basics of physics and chemistry.', '123e4567-e89b-12d3-a456-426655440000');

-- Insert some sample quizzes for user 'jane_smith'
INSERT INTO quizzes (title, description, user_id) VALUES
    ('History Quiz 1', 'A quiz on world history.', '223e4567-e89b-12d3-a456-426655440000'),
    ('Geography Quiz 1', "A quiz on the world's continents and oceans.", '223e4567-e89b-12d3-a456-426655440000');

-- Insert some sample notes for user 'bob_jones'
INSERT INTO notes (title, content, user_id) VALUES
    ('Math Notes', 'My notes on algebra and geometry.', '323e4567-e89b-12d3-a456-426655440000'),
    ('Science Notes', 'My notes on biology and earth science.', '323e4567-e89b-12d3-a456-426655440000'),
    ('English Notes', 'My notes on Shakespeare and modern literature.', '323e4567-e89b-12d3-a456-426655440000');
