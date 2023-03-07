const Question = require("../models/question");

async function getByQuizId(req, res) {
    try {
        const quiz_id = parseInt(req.params.id);
        const questions = await Question.getByQuizId(quiz_id);
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
}

async function getByQuestionId(req, res) {
    try {
        const question_id = parseInt(req.params.q_id);
        const question = await Question.getByQuestionId(question_id);
        res.status(200).json(question);
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
}

async function create(req, res) {
    try {
        req.body.quiz_id = parseInt(req.params.id);
        const question = await Question.create(req.body);
        res.status(201).json(question);
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
}

async function destroy(req, res) {
    try {
        const id = parseInt(req.params.q_id);
        const question = await Question.getByQuestionId(id);
        await question.destroy();
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
}

async function update(req, res) {
    try {
        const id = parseInt(req.params.q_id);
        const question = await Question.getByQuestionId(id);
        const result = await question.update(req.body);
        res.status(200).json(result);
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