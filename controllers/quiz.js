const Quiz = require("../models/quiz");

async function getAllQuizzes(req, res) {
    try {
        const quizzes = await Quiz.getAllQuizzes();
        res.status(200).json(quizzes);
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
}

async function getAllQuizzesByUserId(req, res) {
    try {
        const user_id = parseInt(req.params.id)
        // Corrected: const { user_id } = req.params;
        const quizzes = await Quiz.getAllQuizzesByUserId(user_id);
        res.status(200).json(quizzes)
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
}

async function getOneQuizById(req, res) {
    try {
        const id = parseInt(req.params.id);
        // Corrected: const { id } = req.params;
        const quiz = await Quiz.getOneQuizById(id);
        res.status(200).json(quiz);
    } catch (err) {
        res.status(404).json({ "error": err.message }) // check status 404 or 500
    }
}

async function updateQuizById(req, res) {
    try {
        const { id } = req.params;
        const { title, description, user_id } = req.body;
        const quiz = await Quiz.getOneQuizById(id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        // if (quiz.user_id !== req.user.id) {
        //     return res.status(403).json({ message: 'You are not authorized to update this quiz' });
        // }
        const updatedQuiz = await quiz.updateQuizById(id, title, description, user_id);
        res.status(200).json(updatedQuiz);
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
}

async function deleteQuizById(req, res, next) {
    try {
        const { id } = req.params;
        const quiz = await Quiz.getOneQuizById(id);
        console.log(quiz);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        // if (quiz.user_id !== req.user.id) {
        //     return res.status(403).json({ message: 'You are not authorized to delete this quiz' });
        // }
        await quiz.deleteQuizById(id);
        return res.status(204).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
}

async function createQuiz(req, res) {
    try {
        const { title, description, user_id } = req.body;
        const quiz = await Quiz.create(title, description, user_id);
        res.status(201).json(quiz);
    } catch (error) {
        res.status(404).json({"error": error.message})
    }
}

module.exports = {
    getAllQuizzes,
    getAllQuizzesByUserId,
    getOneQuizById,
    updateQuizById,
    deleteQuizById,
    createQuiz
}