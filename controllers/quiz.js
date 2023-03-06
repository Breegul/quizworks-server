const Quiz = require("../models/quiz");

async function index (req, res) {
    try {
        const quizzes = await Quiz.getAll();
        res.status(200).json(quizzes);
    } catch (err) {
        res.status(500).json({"error": err.message});
    }
}

async function indexUserId(req, res) {
    try {
        const user_id = parseInt(req.params.id)
        const quizzes = await Quiz.getByUserId(user_id);
        res.status(200).json(quizzes)
    } catch (err) {
        res.status(500).json({"error": err.message});
    }
}

async function show (req, res) {
    try {
        const id = parseInt(req.params.id);
        const quiz = await Quiz.getById(id);
        res.status(200).json(quiz);
    } catch (err) {
        res.status(404).json({"error": err.message})
    }
}

module.exports = {
    index,
    show,
    indexUserId
}