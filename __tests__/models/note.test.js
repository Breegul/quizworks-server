const Note = require('../../models/note');

describe('Note model', () => {
    let note;

    beforeAll(() => {
        note = new Note();
    });

    test('constructor is a function', () => {
        expect(typeof Note).toBe('function');
      });

    describe('getNoteById', () => {
        test('is a function', () => {
            expect(typeof note.getNoteById).toBe('function');
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
