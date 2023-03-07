const noteModel = require('../models/note.js');

async function getNoteById(req, res) {
    const { id } = req.params;
    try {
        const noteData = await noteModel.getNoteById(id);
        if (!noteData) {
            return res.status(404).json({ message: 'Note not found' });
        }
        return res.json(noteData);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function getAllNotesByUserId(req, res) {
    const { userId } = req.params;
    try {
        const notesData = await note.getAllByUserId(userId);
        return res.json(notesData);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function createNote(req, res) {
    const { title, content, userId } = req.body;
    try {
        const noteData = await noteModel.createNote(title, content, userId);
        return res.json(noteData);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function updateNoteById(req, res) {
    const { id } = req.params;
    const { title, content, userId } = req.body;
    try {
        const noteData = await noteModel.updateNoteById(id, title, content, userId);
        if (!noteData) {
            return res.status(404).json({ message: 'Note not found' });
        }
        return res.json(noteData);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function deleteNoteById(req, res) {
    const { id } = req.params;
    try {
        await noteModel.deleteNoteById(id);
        return res.sendStatus(204);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getNoteById,
    getAllNotesByUserId,
    createNote,
    updateNoteById,
    deleteNoteById,
  };