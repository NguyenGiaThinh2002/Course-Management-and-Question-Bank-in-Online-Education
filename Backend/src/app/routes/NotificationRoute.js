const express = require('express');
const multer = require('multer');
const notificationController = require('../controllers/NotificationController');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/createNotification', notificationController.createNotification);
router.get('/getNotification/:classID', notificationController.getNotification);
router.get('/getNotificationById/:notificationId', notificationController.getNotificationById);
router.put('/updateNotification/:notificationId', notificationController.updateNotification);
router.post('/deleteNotification/:notificationId', notificationController.deleteNotification);
router.post('/addComment/:notificationId', notificationController.addComment);
router.post('/deleteComment', notificationController.deleteComment);
// router.post('/upload', upload.single('file'), notificationController.uploadFile);
// router.get('/files', notificationController.getFiles);

module.exports = router;
