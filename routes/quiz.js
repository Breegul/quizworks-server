const {Router} = require('express');
const quizController = require('../controllers/quiz');
const router = Router();
//const { authenticateToken } = require("../controller/token");

router.get('/', quiz.quizController.index);
router.get('/:id', quizController.show);
router.get('/user/:id', quizController.indexUserId);
//router.patch("/:id", authenticateToken, quizController.updateQuizById);
router.put("/:id", quizController.updateQuizById);
//router.delete("/:id", authenticateToken, quizController.deleteQuizById);
router.delete("/:id", quizController.deleteQuizById);

module.exports = router;
