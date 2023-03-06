const Quiz = require("../models/quiz");

async function index (req, res) {
    try {
        const quizzes = await Quiz.getAll();
        res.status(200).json(quizzes);
    } catch (err) {
        res.status(500).json({"error": err.message});
    }
}

module.exports = {
    index
}