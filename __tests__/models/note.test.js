const Note = require('../../models/note');
const { pool } = require('../../database/pool.js');

describe('Note model', () => {

    let note;

    beforeAll(async () => {
        await pool.query('DELETE FROM notes');
        note = new Note();
    });

    afterAll(async () => {
        await pool.end();
    });

    test('constructor is a function', () => {
        expect(typeof Note).toBe('function');
    });

    describe('getNoteById', () => {
        test('is a function', () => {
            expect(typeof note.getNoteById).toBe('function');
        });
        test('should return a note object with valid id', async () => {
            // Insert a new note into the database
            const insertQuery = 'INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *';
            const insertValues = ['Test Note', 'This is a test note.'];
            const { rows } = await pool.query(insertQuery, insertValues);
            const noteId = rows[0].id;
            // Retrieve the note by id
            const result = await note.getNoteById(noteId);
            // Check if the result is a note object
            expect(result).toBeDefined();
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('title');
            expect(result).toHaveProperty('content');
            expect(result.id).toBe(noteId);
            expect(result.title).toBe('Test Note');
            expect(result.content).toBe('This is a test note.');
        });

        test('should throw an error with invalid id', async () => {
            // Try to retrieve a non-existent note
            await expect(note.getNoteById(999)).rejects.toThrow('Unable to locate note.');
        });
    });

    describe('getAllByUserId', () => {
        test('is a function', () => {
            expect(typeof note.getAllByUserId).toBe('function');
        });
        test('should return an array of note objects for a valid user_id', async () => {
            // Insert two notes into the database with the same user_id
            const insertQuery = 'INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *';
            const insertValues1 = ['Note 1', 'This is note 1.', 1];
            const insertValues2 = ['Note 2', 'This is note 2.', 1];
            const { rows } = await pool.query(insertQuery, insertValues1);
            await pool.query(insertQuery, insertValues2);
            const userId = rows[0].user_id;
            // Retrieve the notes by user_id
            const results = await note.getAllByUserId(userId);
            // Check if the results are an array of note objects
            expect(Array.isArray(results)).toBe(true);
            expect(results.length).toBe(2);
            expect(results[0]).toBeDefined();
            expect(results[0]).toHaveProperty('id');
            expect(results[0]).toHaveProperty('title');
            expect(results[0]).toHaveProperty('content');
            expect(results[0]).toHaveProperty('user_id');
            expect(results[0].user_id).toBe(userId);
            expect(results[1]).toBeDefined();
            expect(results[1]).toHaveProperty('id');
            expect(results[1]).toHaveProperty('title');
            expect(results[1]).toHaveProperty('content');
            expect(results[1]).toHaveProperty('user_id');
            expect(results[1].user_id).toBe(userId);
        });
        test('should return an empty array for an invalid user_id', async () => {
            // Try to retrieve notes with a non-existent user_id
            const results = await note.getAllByUserId(999);
            // Check if the results are an empty array
            expect(Array.isArray(results)).toBe(true);
            expect(results.length).toBe(0);
        });
    });

    describe('createNote', () => {
        test('is a function', () => {
            expect(typeof note.createNote).toBe('function');
        });
        test('should create a new note in the database', async () => {
            const title = 'Test Note';
            const content = 'This is a test note.';
            const userId = 1;
            const result = await note.createNote(title, content, userId);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('title');
            expect(result).toHaveProperty('content');
            expect(result).toHaveProperty('user_id');
            expect(result.title).toBe(title);
            expect(result.content).toBe(content);
            expect(result.user_id).toBe(userId);
            // Check if the note exists in the database
            const query = 'SELECT * FROM notes WHERE id = $1';
            const values = [result.id];
            const { rows } = await pool.query(query, values);
            expect(rows.length).toBe(1);
            expect(rows[0].title).toBe(title);
            expect(rows[0].content).toBe(content);
            expect(rows[0].user_id).toBe(userId);
        });
        test('should throw an error with invalid input', async () => {
            await expect(note.createNote('', '', 1)).rejects.toThrow();
            await expect(note.createNote('Test Note', 'This is a test note.', null)).rejects.toThrow();
            await expect(note.createNote('Test Note', 'This is a test note.', '')).rejects.toThrow();
        });
    });

    describe('updateNoteById', () => {
        test('is a function', () => {
            expect(typeof note.updateNoteById).toBe('function');
        });
    });

    describe('deleteNoteById', () => {
        test('is a function', () => {
            expect(typeof note.deleteNoteById).toBe('function');
        });
        test('should delete an existing note from the database', async () => {
            // Insert a new note into the database
            const insertQuery = 'INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *';
            const insertValues = ['Test Note', 'This is a test note.', 1];
            const { rows } = await pool.query(insertQuery, insertValues);
            const noteId = rows[0].id;
            // Delete the note by id
            await note.deleteNoteById(noteId);
            // Check if the note was deleted from the database
            const query = 'SELECT * FROM notes WHERE id = $1';
            const values = [noteId];
            const result = await pool.query(query, values);
            expect(result.rows.length).toBe(0);
        });
        test('should throw an error with invalid id', async () => {
            // Delete any notes with the specified ID
            await pool.query('DELETE FROM notes WHERE id = $1', [999]);
            // Try to delete a non-existent note
            await expect(note.deleteNoteById(999)).rejects.toThrow('Unable to locate note.');
        });
    });
});
