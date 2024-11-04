const mongoose = require('mongoose');

const uri = ""
async function connect() {
    try {
        await mongoose.connect(uri);
        console.log('Connect DataBase!!!');
    } catch (error) {
        console.log('Connect failure!!!');
    }
}

module.exports = { connect };
