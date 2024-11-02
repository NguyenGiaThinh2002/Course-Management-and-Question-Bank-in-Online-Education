const mongoose = require('mongoose');

const GroupChat = new mongoose.Schema({
    classID: {type: mongoose.Schema.Types.ObjectId, ref: 'Class', maxLength: 255},
    chatName: {type: 'string', maxLength: 255},
    studentID: {type: mongoose.Schema.Types.ObjectId, ref: 'User', maxLength: 255},
    createdAt: {type: Date, default: Date.now},
}, {collection: 'groupChat'})

module.exports = mongoose.model('GroupChat', GroupChat);