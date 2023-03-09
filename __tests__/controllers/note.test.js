const noteController = require('../../controllers/note.js');

describe('Note controller', () => {

    describe('getNoteById', () => {

        afterAll(async () => {
            // Clean up the database after the tests
            await noteModel.deleteAllNotes();
        });

        test('getNoteById should be a function', () => {
            expect(typeof noteController.getNoteById).toBe('function');
        });
        test('should return 404 for non-existent note', async () => {
            const res = await request(app).get('/notes/123456789');
            expect(res.status).toEqual(404);
            expect(res.body.message).toEqual('Note not found');
        });
        test('should return a note for a valid id', async () => {
            // create a note to test against
            const note = await noteModel.createNote({
                title: 'Test note',
                content: 'This is a test note',
                userId: 1,
            });
            const res = await request(app).get(`/notes/${note.id}`);
            expect(res.status).toEqual(200);
            expect(res.body).toMatchObject({
                id: note.id,
                title: note.title,
                content: note.content,
                userId: note.userId,
            });
        });

        describe('getAllNotesByUserId', () => {

            let userId;
            let noteId;

            beforeAll(async () => {
                // create a user to associate notes with
                const userQuery = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id';
                const userValues = ['user9866', 'password'];
                const userResult = await pool.query(userQuery, userValues);
                userId = userResult.rows[0].id;

                // create a note associated with the user
                const noteQuery = 'INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING id';
                const noteValues = ['Test Note', 'This is a test note', userId];
                const noteResult = await pool.query(noteQuery, noteValues);
                noteId = noteResult.rows[0].id;
            });

            afterAll(async () => {
                // delete the note and associated user
                const deleteNoteQuery = 'DELETE FROM notes WHERE id = $1';
                const deleteUserQuery = 'DELETE FROM users WHERE id = $1';
                const deleteNoteValues = [noteId];
                const deleteUserValues = [userId];
                await pool.query(deleteNoteQuery, deleteNoteValues);
                await pool.query(deleteUserQuery, deleteUserValues);
            });

            test('getAllNotesByUserId should be a function', () => {
                expect(typeof noteController.getAllNotesByUserId).toBe('function');
            });
            test('should return an array of notes', async () => {
                const response = await request(app).get(`/users/${userId}/notes`);
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBeGreaterThan(0);
            });
            test('should return only notes associated with the given user id', async () => {
                const otherUserId = userId + 1;
                // create a note associated with a different user
                const noteQuery = 'INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING id';
                const noteValues = ['Test Note', 'This is a test note', otherUserId];
                await pool.query(noteQuery, noteValues);
                const response = await request(app).get(`/users/${userId}/notes`);
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBe(1);
                expect(response.body[0].id).toBe(noteId);
                const deleteNoteQuery = 'DELETE FROM notes WHERE user_id = $1';
                const deleteNoteValues = [otherUserId];
                await pool.query(deleteNoteQuery, deleteNoteValues);
            });
            test('should return a 500 error if the user id is not a number', async () => {
                const response = await request(app).get('/users/not-a-number/notes');
                expect(response.status).toBe(500);
                expect(response.body).toHaveProperty('message', 'Internal server error');
            });
            test('should return a 404 error if no notes are found for the given user id', async () => {
                const response = await request(app).get(`/users/${userId + 100}/notes`);
                expect(response.status).toBe(404);
                expect(response.body).toHaveProperty('message', 'No notes found for user');
            });
        });

        describe('createNote', () => {
            test('createNote should be a function', () => {
                expect(typeof noteController.createNote).toBe('function');
            });
            test('should create a new note successfully', async () => {
                const mockNoteData = {
                    title: 'Mock Note',
                    content: 'This is a mock note',
                    userId: 1,
                };
                const mockNoteResponse = {
                    id: 1,
                    ...mockNoteData,
                };
                const req = {
                    body: mockNoteData,
                };
                const res = {
                    json: jest.fn().mockReturnValue(mockNoteResponse),
                    status: jest.fn().mockReturnThis(),
                };
                noteModel.createNote = jest.fn().mockResolvedValue(mockNoteResponse);
                await createNote(req, res);
                expect(noteModel.createNote).toHaveBeenCalledWith(mockNoteData.title, mockNoteData.content, mockNoteData.userId);
                expect(res.json).toHaveBeenCalledWith(mockNoteResponse);
                expect(res.status).toHaveBeenCalledWith(200);
            });
            test('should handle errors', async () => {
                const mockNoteData = {
                    title: 'Mock Note',
                    content: 'This is a mock note',
                    userId: 1,
                };
                const req = {
                    body: mockNoteData,
                };
                const res = {
                    json: jest.fn(),
                    status: jest.fn().mockReturnThis(),
                };

                const mockError = new Error('Internal server error');
                noteModel.createNote = jest.fn().mockRejectedValue(mockError);
                await createNote(req, res);
                expect(noteModel.createNote).toHaveBeenCalledWith(mockNoteData.title, mockNoteData.content, mockNoteData.userId);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
                expect(console.error).toHaveBeenCalledWith(mockError);
            });
        });

        describe('updateNoteById', () => {

            let noteId;

            beforeAll(async () => {
                const note = await noteModel.createNote(
                    'Test Note Title',
                    'Test Note Content',
                    'user123'
                );
                noteId = note.id;
            });

            afterAll(async () => {
                await noteModel.deleteNoteById(noteId);
            });

            test('updateNoteById should be a function', () => {
                expect(typeof noteController.updateNoteById).toBe('function');
            });
            test('should return 404 if note not found', async () => {
                const response = await request(app)
                    .put('/notes/invalid_id')
                    .send({
                        title: 'Updated Test Note Title',
                        content: 'Updated Test Note Content',
                        userId: 'user123',
                    });
                expect(response.status).toBe(404);
                expect(response.body.message).toBe('Note not found');
            });
            test('should update the note and return the updated note', async () => {
                const response = await request(app)
                    .put(`/notes/${noteId}`)
                    .send({
                        title: 'Updated Test Note Title',
                        content: 'Updated Test Note Content',
                        userId: 'user123',
                    });
                expect(response.status).toBe(200);
                expect(response.body.title).toBe('Updated Test Note Title');
                expect(response.body.content).toBe('Updated Test Note Content');
                expect(response.body.userId).toBe('user123');
            });
            test('should return 500 if there is an internal server error', async () => {
                jest.spyOn(noteModel, 'updateNoteById').mockImplementation(() => {
                    throw new Error();
                });
                const response = await request(app)
                    .put(`/notes/${noteId}`)
                    .send({
                        title: 'Updated Test Note Title',
                        content: 'Updated Test Note Content',
                        userId: 'user123',
                    });
                expect(response.status).toBe(500);
                expect(response.body.message).toBe('Internal server error');
            });
        });

        describe('deleteNoteById', () => {

            beforeEach(async () => {
                // Create a note for testing
                note = await noteModel.createNote(
                    'Test Note',
                    'This is a test note',
                    1
                );
            });

            afterEach(async () => {
                // Delete the note after testing
                await noteModel.deleteNoteById(note.id);
            });

            test('deleteNoteById should be a function', () => {
                expect(typeof noteController.deleteNoteById).toBe('function');
            });
            test('should return 204 status code on success', async () => {
                const response = await request(app).delete(`/notes/${note.id}`);
                expect(response.status).toBe(204);
            });
            test('should delete the note from the database', async () => {
                await request(app).delete(`/notes/${note.id}`);
                const deletedNote = await noteModel.getNoteById(note.id);
                expect(deletedNote).toBeNull();
            });
            test('should return 404 status code if note does not exist', async () => {
                const response = await request(app).delete('/notes/1000');
                expect(response.status).toBe(404);
            });
            test('should return an error message if note does not exist', async () => {
                const response = await request(app).delete('/notes/1000');
                expect(response.body.message).toBe('Note not found');
            });
            test('should return 500 status code on server error', async () => {
                // Replace the deleteNoteById method with one that always throws an error
                noteModel.deleteNoteById = jest.fn().mockImplementationOnce(() => {
                    throw new Error('Database error');
                });
                const response = await request(app).delete(`/notes/${note.id}`);
                expect(response.status).toBe(500);
            });
            test('should return an error message on server error', async () => {
                // Replace the deleteNoteById method with one that always throws an error
                noteModel.deleteNoteById = jest.fn().mockImplementationOnce(() => {
                    throw new Error('Database error');
                });
                const response = await request(app).delete(`/notes/${note.id}`);
                expect(response.body.message).toBe('Internal server error');
            });
        });
    });
});