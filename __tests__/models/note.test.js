const Note = require('../../models/note');
const { pool } = require('../../database/pool.js');

describe('Note model', () => {
    let note;

    beforeAll(() => {
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
    });

    describe('createNote', () => {
        test('is a function', () => {
            expect(typeof note.createNote).toBe('function');
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
    });
});
