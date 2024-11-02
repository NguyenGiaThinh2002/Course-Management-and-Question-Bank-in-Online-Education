const Assignment = require('../models/Assignment');
const SubmittedAssignment = require('../models/SubmittedAssignment')
const mongoose = require('mongoose');
class AssignmentController {
    async createAssignment(req, res){
        try {
            const {classID, title, content, grade, files, submitLatePermission, dueDay,} = req.body;
            const assignment = await Assignment.create({classID, title, content, grade, files, submitLatePermission, dueDay});
            return res.status(200).json(assignment);
    
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    async getAllAssignmentsById(req, res) {
        try {
            const classID = req.params.classID;
            console.log(classID);
            const assignments  = await Assignment.find({ classID: { $in: [classID] } });
            // const assignments = await Assignment.find({ classID: mongoose.Types.ObjectId(classID) });
            // const assignments = await Assignment.find({ ClassID: classObjectId });
            return res.status(200).json(assignments);
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    async updateAssignmentById(req, res){
        try {
            const { _id, content, files, dueDay, classID, title, submitLatePermission, grade} = req.body;
      
            const updatedAssignment = await Assignment.findByIdAndUpdate(
                _id,
              { content, files, dueDay, classID, title, submitLatePermission, grade },
              { new: true }
            );
      
            if (!updatedAssignment) {
              return res.status(404).json({ error: 'Assignment not found' });
            }
      
            return res.status(200).json(updatedAssignment);
          } catch (error) {
            console.error('Error updating class:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
      }

    //   async deleteAssignment(req, res){
    //     try {
    //         const assignmentID= req.params.assignmentID;
    //         const deleltedSubmittedAssignment = await SubmittedAssignment.deleteMany({ assignmentID: assignmentID})
    //         await deleltedSubmittedAssignment.save()
    //         const assignment = await Assignment.deleteOne({_id : assignmentID});
    //         return res.status(200).json(assignment, deleltedSubmittedAssignment);
    //     } catch (error) {
    //         return res.status(400).send(error);
    //     }
    // }
    async deleteAssignment(req, res){
        try {
            const assignmentID = req.params.assignmentID;
            
            // Delete submitted assignments related to the assignment
            await SubmittedAssignment.deleteMany({ assignmentID: assignmentID });
    
            // Delete the assignment itself
            await Assignment.deleteOne({ _id: assignmentID });
    
            // Send success response
            return res.status(200).json({ message: 'Assignment deleted successfully' });
        } catch (error) {
            return res.status(400).send(error);
        }
    }
    

}

module.exports = new AssignmentController;