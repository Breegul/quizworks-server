const Answer = require("../models/answer");

async function getByQuestionId(req, res) {
    try {
        const question_id = parseInt(req.params.q_id);
        // Corrected: const { questionId } = req.params;
        const answers = await Answer.getByQuestionId(question_id);
        res.status(200).json(answers);
    } catch (err) {
        res.status(500).json({"error":err.message});
    }
}

async function getByAnswerId(req, res) {
    try {
        const answer_id = parseInt(req.params.a_id);
        // Corrected: const { answerId } = req.params;
        const answer = await Answer.getByAnswerId(answer_id);
        res.status(200).json(answer);
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
}

async function create(req, res) {
    try {
        req.body.question_id = parseInt(req.params.q_id);
        // Corrected: const { text, is_correct, question_id } = req.body;
        const answer = await Answer.create(req.body);
        // Corrected: const answer = await Answer.create(text, is_correct, question_id);
        res.status(201).json(answer);
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
}

async function destroy(req, res) {
    try {
        const id = parseInt(req.params.a_id);
        // Corrected: const { answerId } = req.params;
        const answer = await Answer.getByAnswerId(id);
        await answer.destroy();
        // Corrected: const deleteId = await answer.destroy();
        res.sendStatus(204);
        // Corrected: res.status(200).json({ id: deletedId });
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
}

async function update(req, res) {
    try {
        // Corrected: const { answerId } = req.params;
        // Corrected: const { text, is_correct } = req.body;
        const id = parseInt(req.params.a_id);
        const answer = await Answer.getByAnswerId(id);
        const result = await answer.update(req.body);
        // Corrected: const result = await Answer.update(req.body);
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({"error": err.message});
    }
}

module.exports = {
    getByQuestionId,
    getByAnswerId,
    create,
    destroy,
    update
}