const mongoose = require('mongoose');

const User = new mongoose.Schema({

    username: {type: 'string', maxLength: 255},
    photoURL: {type: 'string', maxLength: 255},
    email: {type: 'string', maxLength: 255},
    role: {type: 'string', default: "empty"},
}, {collection: 'user'});

module.exports = mongoose.model('User', User);