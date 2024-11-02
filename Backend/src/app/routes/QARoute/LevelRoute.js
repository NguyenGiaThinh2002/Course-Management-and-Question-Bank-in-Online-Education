const express = require('express')
const router = express.Router();
const levelController = require('../../controllers/QAControllers/LevelController')

router.post('/createLevel', levelController.createLevel);
router.get('/getAllLevels', levelController.getAllLevels);


module.exports = router;