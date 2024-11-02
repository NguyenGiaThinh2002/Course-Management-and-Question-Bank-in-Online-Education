const mongoose = require('mongoose');

const Colors = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref: 'User', maxLength: 255},
    sidebarColor: {type: String, maxLength: 255},
    headerColor: {type: String, maxLength: 255},
}, {collection: 'colors'})

module.exports = mongoose.model('Colors', Colors);