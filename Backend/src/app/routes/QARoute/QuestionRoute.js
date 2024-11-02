const express = require('express')
const router = express.Router();
const questionController = require('../../controllers/QAControllers/QuestionController')

router.post('/createQuestion', questionController.createQuestion);
router.post('/editQuestion', questionController.editQuestion);
router.post('/editQuestionLevel', questionController.editQuestionLevel);
router.post('/deleteQuestion/:questionId', questionController.deleteQuestion);
router.post('/permitQuestion/:questionId', questionController.permitQuestion);
router.post('/unPermitQuestion/:questionId', questionController.unPermitQuestion);
router.get('/getQuestionsByFolderID/:folderId', questionController.getQuestionsByFolderID);
router.get('/getQuestionsByClassID/:classId', questionController.getQuestionsByClassID);
module.exports = router;