// routes/uploadRoutes.js
const express = require('express');
const QAUploadController = require('../../controllers/QAControllers/QAUploadController');

const router = express.Router();

router.post('/QAupload/:folderId', QAUploadController.handleQAFileUpload);
router.post('/pdfUploadMulter', QAUploadController.pdfUploadMulter);

router.post('/createQAFiles', QAUploadController.createQAFiles);
router.get('/getQAFiles/:fileID', QAUploadController.getQAFiles);
router.get('/getAllQAFiles/:folderID', QAUploadController.getAllQAFiles);


module.exports = router;
