const express = require('express');
const noteController = require('../controllers/note');
const router = express.Router();

router.get('/:id', noteController.getNoteById);
router.get('/user/:userId', noteController.getAllNotesByUserId); // Get all notes for a user
router.post("/", noteController.createNote)
router.put("/:id", noteController.updateNoteById)
router.delete("/:id", noteController.deleteNoteById)

module.exports = router;
