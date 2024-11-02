const QuestionsModel = require('../../models/QAModel/QuestionModel');
const ClassFolderModel = require('../../models/QAModel/ClassFolder')


class QuestionController{
    async createQuestion(req, res){
        try {
            const {folderID, pdfID, levelID, questionText} = req.body;
            const questionModel  = await QuestionsModel.create({folderID, pdfID, levelID, questionText});
            return res.status(201).json(questionModel);
        } catch (error) {
            return res.status(400).send(error);
        }
    }
    async getQuestionsByFolderID(req, res){
        try {
            const folderID = req.params.folderId;
            const questions = await QuestionsModel.find({folderID: folderID});
            return res.status(201).json(questions);
        } catch (error) {
            return res.status(400).send(error);
        }
    }

    async getQuestionsByClassID(req, res) {
        try {
          const classId = req.params.classId;
            console.log("classId", classId);
            
          // Step 1: Fetch folderIds from the ClassFolderModel
          const folders = await ClassFolderModel.find({ classID: classId });
          console.log("folders", folders);
          
          const folderIds = folders.map(folder => folder._id);
      
          if (folderIds.length > 0) {
            // Step 2: Fetch questions based on folderIds from the QuestionsModel
            const questions = await QuestionsModel.find({
              folderID: { $in: folderIds },
              isPermitted: true
            });
      
            // Return the questions in the response
            return res.status(200).json(questions);
          } else {
            // If no folders found, return an empty array
            return res.status(200).json([]);
          }
        } catch (error) {
          // Log the error and return an error response
          console.error(error);
          return res.status(500).json({ error: 'Internal server error' });
        }
      }
      

    async editQuestion(req, res){
        try {
            const {questionId, questionText} = req.body;
            const questionModel = await QuestionsModel.findByIdAndUpdate(questionId, {questionText}, {new: true})
            return res.status(200).json(questionModel);
        } catch (error) {
            return res.status(400).send(error);
            
        }
    }
    async deleteQuestion(req, res){
        try {
            const questionId = req.params.questionId;
            const questionModel = await QuestionsModel.findByIdAndDelete(questionId);
            return res.status(200).json(questionModel);
        } catch (error) {
            return res.status(400).send(error);
            
        }
    }
    async permitQuestion(req, res)
    {
        try 
        {
            const questionId = req.params.questionId;
            const questionModel = await QuestionsModel.findByIdAndUpdate(questionId, {isPermitted: true});
            return res.status(200).json(questionModel);
        } 
        catch (error) 
        {
            return res.status(400).send(error);
        }
    }

    async unPermitQuestion(req, res)
    {
        try 
        {
            const questionId = req.params.questionId;
            const questionModel = await QuestionsModel.findByIdAndUpdate(questionId, {isPermitted: false});
            return res.status(200).json(questionModel);
        } 
        catch (error) 
        {
            return res.status(400).send(error);
        }
    }

    async editQuestionLevel(req, res){
        try {
            const {questionId, levelID} = req.body;
            const questionModel = await QuestionsModel.findByIdAndUpdate(questionId, {levelID}, {new: true})
            return res.status(200).json(questionModel);
        } catch (error) {
            return res.status(400).send(error);
            
        }
    }
}

module.exports = new QuestionController();