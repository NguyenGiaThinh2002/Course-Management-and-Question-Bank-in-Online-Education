const express = require('express')
const router = express.Router();
const answerController = require('../../controllers/QAControllers/AnswerController')

router.post('/createAnswer', answerController.createAnswer);
router.post('/editAnswer', answerController.editAnswer);
router.post('/deleteAnswer/:questionId', answerController.deleteAnswer);
router.get('/getRightAnswer/:questionId', answerController.getRightAnswer);
router.get('/getAllAnswers/:questionId', answerController.getAllAnswers);
module.exports = router;