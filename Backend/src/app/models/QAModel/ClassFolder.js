const mongoose = require('mongoose');

const ClassFolder = new mongoose.Schema({
    classID: {type: mongoose.Schema.Types.ObjectId, ref: 'Class', maxLength: 255},
    folderName: {type: 'string'},
    // filename: String,
    // publicUrl: String,
}, {collection: 'classFolder'})
module.exports = mongoose.model('ClassFolder', ClassFolder);