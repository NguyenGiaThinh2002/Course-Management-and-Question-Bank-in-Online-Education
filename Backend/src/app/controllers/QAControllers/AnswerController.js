const AnswerModel = require('../../models/QAModel/AnswerModel');

class AnswerController{
    async createAnswer(req, res){
        try {
            const {questionId, answerText, pdfName, isRightAnswer} = req.body;
            const answerModel  = await AnswerModel.create({questionId, answerText, pdfName, isRightAnswer});
            return res.status(201).json(answerModel);
        } catch (error) {
            return res.status(400).send(error);
        }
    }

    async getRightAnswer(req, res)
    {
        try 
        {
            const questionId = req.params.questionId;
            const answer = await AnswerModel.find({questionId: questionId, isRightAnswer: true});
            return res.status(201).json(answer);
        } 
        catch (error) 
        {
            return res.status(400).send(error);
        }
    }

    async getAllAnswers(req, res)
    {
        try 
        {
            const questionId = req.params.questionId;
            const answer = await AnswerModel.find({questionId: questionId});
            return res.status(201).json(answer);
        } 
        catch (error) 
        {
            return res.status(400).send(error);
        }
    }


    async editAnswer(req, res){
        try {
            const {answerId, answerText} = req.body;
            const answerModel = await AnswerModel.findByIdAndUpdate(answerId, {answerText}, {new: true})
            return res.status(200).json(answerModel);
        } catch (error) {
            return res.status(400).send(error);
            
        }
    }

    async deleteAnswer(req, res)
    {
        try {
            const questionId = req.params.questionId;
            const answerModel = await AnswerModel.deleteMany({questionId: questionId})
            return res.status(200).json(answerModel);
        } catch (error) {
            return res.status(400).send(error);
        }
    }

    // async getAllAnswers(req, res)
    // {
    //     try 
    //     {
    //         const answers = await AnswerModel.find();
    //         return res.status(201).json(answers);
    //     } 
    //     catch (error) 
    //     {
    //         return res.status(400).send(error);
    //     }
    // }


}

module.exports = new AnswerController();