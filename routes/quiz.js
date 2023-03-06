const {Router} = require('express');
const quizController = require('../controllers/quiz');
const router = Router();
//const { authenticateToken } = require("../controller/token");

router.get('/', quizController.getAllQuizzes);
router.get('/:id', quizController.getOneQuizById);
router.get('/user/:id', quizController.getAllQuizzesByUserId);
//router.patch("/:id", authenticateToken, quizController.updateQuizById);
router.put("/:id", quizController.updateQuizById);
//router.delete("/:id", authenticateToken, quizController.deleteQuizById);
router.delete("/:id", quizController.deleteQuizById);
router.post("/", quizController.createQuiz)

module.exports = router;
