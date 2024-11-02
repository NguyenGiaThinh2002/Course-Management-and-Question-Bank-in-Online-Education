const Auth = require('./AuthRoute')
const ClassRoom = require('./ClassRoomRoute')
const uploadRoutes = require('./uploadRoutes');
const notificationRoute = require('./NotificationRoute')
const assignmentRoute = require('./AssignmentRoute')
const submittedAssignment = require('./SubmittedAssignment')
const colorRoute = require('./ColorRoute')
const classFolderRoute = require('./QARoute/ClassFolderRoute')
const pdfRouter = require('./QARoute/PdfRoute')
const questionRouter = require('./QARoute/QuestionRoute')
const levelRouter = require('./QARoute/LevelRoute')
const answerRouter = require('./QARoute/AnswerRoute')
const uploadQARoute = require('./QARoute/QAUploadRoute')

function route(app){
    app.use('/auth', Auth);
    app.use('/class', ClassRoom);
    app.use('/api', uploadRoutes);
    app.use('/notification', notificationRoute);
    app.use('/assignment', assignmentRoute);
    app.use('/submittedAssignment', submittedAssignment);
    app.use('/colors', colorRoute);
    // QARoute
    app.use('/classFolder', classFolderRoute);
    app.use('/pdf', pdfRouter);
    app.use('/question', questionRouter);
    app.use('/level', levelRouter);
    app.use('/answer', answerRouter);
    app.use('/uploadQA', uploadQARoute);
}
module.exports = route;