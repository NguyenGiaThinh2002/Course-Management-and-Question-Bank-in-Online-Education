const express = require('express');
const authController = require('../controllers/AuthController');
const router = express.Router();

router.post('/signup', authController.register);
router.get('/getUser', authController.getUser);
router.get('/getOneUser', authController.getOneUser);
router.post('/addUser/:classID', authController.addUser);
router.post('/addWaitingStudent', authController.addWaitingStudent);
router.post('/setWaitingStudents', authController.setWaitingStudents);
router.get('/getUserById', authController.getUserById)
router.put('/updateUserRole/:userId',authController.updateUserRole);
router.post('/checkAdmin', authController.checkAdmin)
// router.use("/:slug", loginController.show)

module.exports = router;
