const mongoose = require('mongoose');

const GroupChatMessage = new mongoose.Schema({
    classID: {type: mongoose.Schema.Types.ObjectId, ref: 'Class', maxLength: 255},
    chatName: {type: 'string', maxLength: 255},
    userID: {type: mongoose.Schema.Types.ObjectId, ref: 'User', maxLength: 255},
    content: {type: 'string', maxLength: 255},
    createdAt: {type: Date, default: Date.now},
}, {collection: 'groupChatMessage'})

module.exports = mongoose.model('GroupChatMessage', GroupChatMessage);