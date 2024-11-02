const mongoose = require('mongoose');

const PdfFiles = new mongoose.Schema({
    folderID: {type: mongoose.Schema.Types.ObjectId, ref: 'classFolder', maxLength: 255},
    originalName: {type: 'string'},
    // diskStoragePath: {type: 'string'},
    pdfBuffer: { type: Buffer, required: true },

}, {collection: 'pdfFiles'})
module.exports = mongoose.model('PdfFiles', PdfFiles);