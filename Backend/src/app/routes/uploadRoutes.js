// routes/uploadRoutes.js
const express = require('express');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

router.post('/upload', uploadController.handleFileUpload);
router.post('/createFiles', uploadController.createFiles)
router.get('/getFiles/:fileID', uploadController.getFiles);
router.get('/getAllFiles', uploadController.getAllFiles)

module.exports = router;
