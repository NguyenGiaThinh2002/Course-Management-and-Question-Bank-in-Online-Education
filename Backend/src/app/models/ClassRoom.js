const mongoose = require('mongoose');

const ClassRoom = new mongoose.Schema({
    classCode: {type: 'string', maxLength: 255},
    teacherID: {type: mongoose.Schema.Types.ObjectId, ref: 'User', maxLength: 255},
    className: {type: 'string', maxLength: 255},
    description: {type: 'string'},
    waitingStudents: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', maxLength: 255}],
    studentID: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', maxLength: 255}],
    // isStored: {type: 'boolean', maxLength: 10, default: false},
    isStored: {type: 'boolean', default: false},
    // password:{type: 'string', maxLength: 255},
    createdAt: {type: Date, default: Date.now},
}, {collection: 'classRoom'});

module.exports = mongoose.model('ClassRoom', ClassRoom);