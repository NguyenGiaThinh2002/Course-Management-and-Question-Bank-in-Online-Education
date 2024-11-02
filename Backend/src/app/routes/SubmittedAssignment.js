const express = require('express');
const submittedAssignment = require('../controllers/SubmittedAssignmentController')
const router = express.Router();

router.post('/createSubmittedAssignment', submittedAssignment.createSubmittedAssignment);
router.get('/getAllSubmittedAssignmentsById/:classID', submittedAssignment.getAllSubmittedAssignmentsById)
router.put('/updateSubmittedAssignmentById', submittedAssignment.updateSubmittedAssignmentById)
router.put('/updateStudentSubmittedAssignmentById', submittedAssignment.updateStudentSubmittedAssignmentById)
module.exports = router;