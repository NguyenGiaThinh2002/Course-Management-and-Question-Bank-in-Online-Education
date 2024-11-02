const express = require('express');
const router = express.Router();
const AssignmentController = require('../controllers/AssignmentController');

router.post('/createAssignment', AssignmentController.createAssignment);
router.get('/getAllAssignmentsById/:classID', AssignmentController.getAllAssignmentsById);
router.put('/updateAssignmentsById', AssignmentController.updateAssignmentById);
router.post('/deleteAssignment/:assignmentID', AssignmentController.deleteAssignment);

module.exports = router;