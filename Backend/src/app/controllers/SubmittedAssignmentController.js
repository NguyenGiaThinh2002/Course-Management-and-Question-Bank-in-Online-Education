const SubmittedAssignment = require('../models/SubmittedAssignment')

class SubmittedAssignmentController {
    async createSubmittedAssignment(req, res){
        try {
            const {assignmentID, studentID, submissionFiles, privateComment , classID, isLateSubmission} = req.body;
            console.log(req.body);
            const submittedAssignment = await SubmittedAssignment.create({assignmentID, studentID, submissionFiles, privateComment, classID, isLateSubmission});
            return res.status(200).json(submittedAssignment);
    
        } catch (error) {
            return res.status(400).json(error);
        }
    } 
    async getAllSubmittedAssignmentsById(req, res) {
        try {
            const classID = req.params.classID;
            console.log(classID);
            const submittedAssignment  = await SubmittedAssignment.find({ classID: classID});
            // const submittedAssignment = await SubmittedAssignment.find({ classID: mongoose.Types.ObjectId(classID) });
            // const assignments = await Assignment.find({ ClassID: classObjectId });
            return res.status(200).json(submittedAssignment);
        } catch (error) {
            return res.status(400).json(error);
        }
    }
    async updateSubmittedAssignmentById(req, res) {
        try {
            const {id , grade, teacherResponses} = req.body;
            // markedGrade = true;
            const updatedSubmittedAssignment = await SubmittedAssignment.findByIdAndUpdate(id , { grade: grade, markedGrade: true, teacherResponses: teacherResponses}, { new: true });
            return res.status(200).json(updatedSubmittedAssignment);
        } catch (error) {
            return res.status(400).json(error);
        }
    }
    
    async updateStudentSubmittedAssignmentById(req, res) {
        try {
            const {id , submissionFiles} = req.body;
            // markedGrade = true;
            const updatedStudentSubmittedAssignment = await SubmittedAssignment.findByIdAndUpdate(id , { submissionFiles: submissionFiles}, { new: true });
            return res.status(200).json(updatedStudentSubmittedAssignment);
        } catch (error) {
            return res.status(400).json(error);
        }
    }
}

module.exports = new SubmittedAssignmentController; 