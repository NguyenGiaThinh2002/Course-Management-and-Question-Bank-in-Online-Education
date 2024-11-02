const LevelModel = require('../../models/QAModel/LevelModel');

class LevelController{
    async createLevel(req, res){
        try {
            const {levelManualID, levelName} = req.body;
            const levelModel  = await LevelModel.create({levelManualID, levelName});
            return res.status(201).json(levelModel);
        } catch (error) {
            return res.status(400).send(error);
        }
    }
    async getAllLevels(req, res){
        try {         
            const allLevels  = await LevelModel.find();
            return res.status(201).json(allLevels);
        } catch (error) {
            return res.status(400).send(error);
        }
    }
}

module.exports = new LevelController();