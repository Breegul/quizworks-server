const {Router} = require("express");
const quizController = require("../controllers/quiz");
const questionController = require("../controllers/question");
const answerController = require("../controllers/answer");
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
router.post("/:id/questions", questionController.create);
router.delete("/:id/questions/:q_id", questionController.destroy); // since delete doesn't use :id, it can be left as 0
router.patch("/:id/questions/:q_id", questionController.update);

// answer routes
router.get("/:id/questions/:q_id/answers", answerController.getByQuestionId);
router.get("/:id/questions/:q_id/answers/:a_id", answerController.getByAnswerId);
router.post("/:id/questions/:q_id/answers", answerController.create);
router.delete("/:id/questions/:q_id/answers/:a_id", answerController.destroy);
router.patch("/:id/questions/:q_id/answers/:a_id", answerController.update);

module.exports = router;
