const noteController = require('../../controllers/note.js');

describe('Note controller', () => {

    test('getNoteById should be a function', () => {
        expect(typeof noteController.getNoteById).toBe('function');
    });

    test('getAllNotesByUserId should be a function', () => {
        expect(typeof noteController.getAllNotesByUserId).toBe('function');
    });

    test('createNote should be a function', () => {
        expect(typeof noteController.createNote).toBe('function');
    });

    test('updateNoteById should be a function', () => {
        expect(typeof noteController.updateNoteById).toBe('function');
    });

    test('deleteNoteById should be a function', () => {
        expect(typeof noteController.deleteNoteById).toBe('function');
    });
});
