const ClassFolderModel = require('../../models/QAModel/ClassFolder')

class ClassFolderController{
    async createClassFolder(req, res){
        try {
            const {classID, folderName} = req.body;
            const classFolder  = await ClassFolderModel.create({classID, folderName});
            return res.status(201).json(classFolder);
        } catch (error) {
            return res.status(400).send(error);
        }
    }

    async getClassFolder(req, res){
        try {   
            const classId = req.params.classID;
            const classFolder = await ClassFolderModel.find({ classID: classId });
            return res.status(200).json(classFolder);
        } catch (error) {
            return res.status(400).send(error);
        } 
    }
    async getFolderName(req, res){
        try {
            const folderId = req.params.folderId;
            const classFolder  = await ClassFolderModel.findById(folderId);
            return res.status(201).json({folderName: classFolder.folderName});
        } catch (error) {
            return res.status(400).send(error);
        }
    }
}

module.exports = new ClassFolderController();