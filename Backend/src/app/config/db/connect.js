const mongoose = require('mongoose');

const uri = "mongodb+srv://thinhlatoi4:thinhlatoi2@cluster0.bltd15j.mongodb.net/Ctu-Classroom-db"
async function connect() {
    try {
        await mongoose.connect(uri);
        console.log('Connect DataBase!!!');
    } catch (error) {
        console.log('Connect failure!!!');
    }
}

module.exports = { connect };