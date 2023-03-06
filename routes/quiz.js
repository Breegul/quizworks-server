const {Router} = require("express");
const quizController = require("../controllers/quiz");
const questionController = require("../controllers/question");
const router = Router();
//const { authenticateToken } = require("../controller/token");

router.get("/", quizController.getAllQuizzes);
router.get("/:id", quizController.getOneQuizById);
router.get("/user/:id", quizController.getAllQuizzesByUserId);
//router.patch("/:id", authenticateToken, quizController.updateQuizById);
router.put("/:id", quizController.updateQuizById);
//router.delete("/:id", authenticateToken, quizController.deleteQuizById);
router.delete("/:id", quizController.deleteQuizById);
router.post("/", quizController.createQuiz)

// question routes
router.get("/:id/questions", questionController.getByQuizId);
router.get("/:id/questions/:q_id", questionController.getByQuestionId);
router.post("/:id/questions", questionController.createQuestion);
router.delete("/:id/questions/:q_id", questionController.deleteQuestion); // since delete doesn't use :id can be left as 0

module.exports = router;
