const {Router} = require('express');
const quizController = require('../controllers/quiz');
const router = Router();

router.get('/', quiz.quizController.index);
router.get('/:id', quizController.show);
router.get('/user/:id', quizController.indexUserId);

module.exports = router;
