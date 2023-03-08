const Question = require("../models/question");

async function getByQuizId(req, res) {
    try {
        const quiz_id = parseInt(req.params.id);
        // Corrected: const quizId = req.params.quizId;
        const questions = await Question.getByQuizId(quiz_id);
        res.status(200).json(questions);
        // Corrected: res.status(200).json({ questions: questions });
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
}

async function getByQuestionId(req, res) {
    try {
        const question_id = parseInt(req.params.q_id);
        // Corrected: const questionId = req.params.questionId;
        const question = await Question.getByQuestionId(question_id);
        res.status(200).json(question);
        // Corrected: res.status(200).json({ question: question });
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
}

async function create(req, res) {
    try {
        const quizId = parseInt(req.params.id);
        const text = req.body.text;
        // Corrected: const { text, quizId } = req.body;
        const question = await Question.create(text, quizId);
        // Corrected: const question = await Question.create(text, quizId);
        res.status(201).json(question);
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
}

async function destroy(req, res) {
    try {
        const id = parseInt(req.params.q_id);
        // Corrected: const questionId = req.params.questionId;
        const question = await Question.getByQuestionId(id);
        const deletedQuestionId = await question.destroy();
        res.status(200).json({ questionId: deletedQuestionId });
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
}

async function update(req, res) {
    try {
        const questionId = parseInt(req.params.q_id);
        const quizId = parseInt(req.params.id);
        const { text } = req.body;
        const updatedQuestion = await Question.update(questionId, text, quizId);
        res.status(200).json({ question: updatedQuestion });
    } catch (err) {
        res.status(500).json({"error": err.message});
    }
}

module.exports = {
    getByQuizId,
    getByQuestionId,
    create,
    destroy,
    update
}