const mongoose = require('mongoose');

const Files = new mongoose.Schema({
    originalName: {type: String, maxLength: 255},
    path: {type: String, maxLength: 255},
    createdAt: {type: Date, default: Date.now},
}, {collection: 'files'})

module.exports = mongoose.model('Files', Files);