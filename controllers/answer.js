const Answer = require("../models/answer");

async function getByQuestionId(req, res) {
    try {
        const question_id = parseInt(req.params.q_id);
        const answers = await Answer.getByQuestionId(question_id);
        res.status(200).json(answers);
    } catch (err) {
        res.status(500).json({"error":err.message});
    }
}

async function getByAnswerId(req, res) {
    try {
        const answer_id = parseInt(req.params.a_id);
        const answer = await Answer.getByAnswerId(answer_id);
        res.status(200).json(answer);
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
}

async function createAnswer(req, res) {
    try {
        req.body.question_id = parseInt(req.params.q_id);
        const answer = await Answer.create(req.body);
        res.status(201).json(answer);
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
}

async function deleteAnswer(req, res) {

}

module.exports = {
    getByQuestionId,
    getByAnswerId,
    createAnswer,
    deleteAnswer
}