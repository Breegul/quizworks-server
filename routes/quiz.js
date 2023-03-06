const {Router} = require('express');
const quizController = require('../controllers/quiz');
const router = Router();

router.get('/', quizController.index);

module.exports = router;
