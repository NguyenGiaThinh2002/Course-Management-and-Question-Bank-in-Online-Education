const mongoose = require('mongoose');

const Questions = new mongoose.Schema({
    folderID: {type: mongoose.Schema.Types.ObjectId, ref: 'classFolder', maxLength: 255},
    pdfID: {type: mongoose.Schema.Types.ObjectId, ref: 'pdfFiles', maxLength: 255},
    isPermitted: {type: 'boolean', default: false},
    levelID: {type: 'string'},
    questionText: {type: 'string'}

}, {collection: 'questions'})
module.exports = mongoose.model('Questions', Questions);