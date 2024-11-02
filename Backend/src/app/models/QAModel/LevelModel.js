const mongoose = require('mongoose');

const LevelModel = new mongoose.Schema({
    levelManualID: {type: 'string'},
    levelName: {type: 'string'},
    // filename: String,
    // publicUrl: String,
}, {collection: 'levelModel'})
module.exports = mongoose.model('LevelModel', LevelModel);