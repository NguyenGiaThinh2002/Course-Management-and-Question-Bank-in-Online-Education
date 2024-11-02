const mongoose = require('mongoose');
const Schema = require('mongoose')
const SubmittedAssignment = new mongoose.Schema({
    classID: {type: mongoose.Schema.Types.ObjectId, ref: 'Class', maxLength: 255},
    assignmentID: {type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', maxLength: 255},
    studentID: {type: mongoose.Schema.Types.ObjectId, ref: 'User', maxLength: 255},
    markedGrade: {type: Boolean, default: false},
    isLateSubmission: {type: Boolean},
    submissionFiles: [{type: mongoose.Schema.Types.ObjectId, ref: 'files'}],
    submissionDate: {type: Date, default: Date.now},
    grade: {type: 'string', maxLength: 255, default: 0},
    privateComment: {type: Array, default: []},
    teacherResponses: {type: Array, default: []},
}, {collection: 'submittedAssignment'});

module.exports = mongoose.model('SubmittedAssignment', SubmittedAssignment);