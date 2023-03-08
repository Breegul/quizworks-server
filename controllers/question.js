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
        req.body.quiz_id = parseInt(req.params.id);
        req.body.text = parseInt(req.params.text);
        // Corrected: const { text, quizId } = req.body;
        const question = await Question.create(req.body.text, req.body.quiz_id);
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
        await question.destroy();
        // Corrected: const deletedQuestionId = await question.destroy();
        res.sendStatus(204);
        // Corrected: res.status(200).json({ questionId: deletedQuestionId });
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
}

async function update(req, res) {
    try {
        const id = parseInt(req.params.q_id);
        // Corrected: const questionId = req.params.questionId;
        // Corrected: const { text, quizId } = req.body;
        const question = await Question.getByQuestionId(id);
        const result = await question.update(req.body);
        // Corrected: const updatedQuestion = await Question.update(questionId, text, quizId);
        res.status(200).json(result);
        // Corrected: res.status(200).json({ question: updatedQuestion });
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