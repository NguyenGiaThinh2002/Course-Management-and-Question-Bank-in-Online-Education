const mongoose = require('mongoose');

const Answers = new mongoose.Schema({
    questionId: {type: mongoose.Schema.Types.ObjectId, ref: 'questions', maxLength: 255},
    answerText: {type: 'string'},
    pdfName: {type: 'string'},
    isRightAnswer: {type: 'boolean', default: false},
}, {collection: 'answers'})
module.exports = mongoose.model('Answers', Answers);