const express = require('express')
const router = express.Router();
const classFolderController = require('../../controllers/QAControllers/ClassFolderController')

router.post('/createClassFolder', classFolderController.createClassFolder);
router.get('/getClassFolder/:classID', classFolderController.getClassFolder);
router.get('/getFolderName/:folderId', classFolderController.getFolderName);

module.exports = router;