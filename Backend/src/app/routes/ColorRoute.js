const express = require('express')
const router = express.Router();
const colorsController = require('../controllers/ColorController');

router.post('/createColors', colorsController.createColors);
router.get('/getColors/:userID', colorsController.getColors);
// router.post('/createClass', classRoomController.createClass);
// router.get('/getClass', classRoomController.getClass);
// router.get('/getStoredClass', classRoomController.getStoredClass);
// router.get('/getClassById/:classID', classRoomController.getClassByID);
// router.put('/updateClass/:classID', classRoomController.updateClass); 
// router.put('/storeClass/:classID', classRoomController.storeClass); 

module.exports = router;