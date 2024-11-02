const mongoose = require('mongoose');

const Assignment = new mongoose.Schema({
    classID: [{type: mongoose.Schema.Types.ObjectId, ref: 'Class', maxLength: 255}],
    title: {type: 'string', maxLength: 255},
    content: {type: 'string'},
    grade: {type: 'string', maxLength: 255},
    files: [{type: mongoose.Schema.Types.ObjectId, ref: 'files'}],
    submitLatePermission: {type: Boolean},
    dueDay: {type: Date},
    // dueDate: {type: Date},
    // dueTime: {type: Date},
    createdAt: {type: Date, default: Date.now},
}, {collection: 'assignment'});

module.exports = mongoose.model('Assignment', Assignment);