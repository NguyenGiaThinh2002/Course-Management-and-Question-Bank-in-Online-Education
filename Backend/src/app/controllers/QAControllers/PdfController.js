const PdfModel = require('../../models/QAModel/PdfModel');

class PdfController{
    async createPdf(req, res){
        try {
            const {folderID,pdfBuffer, originalName} = req.body;
            const pdfModel  = await PdfModel.create({folderID,pdfBuffer, originalName});
            return res.status(201).json(pdfModel);
        } catch (error) {
            return res.status(400).send(error);
        }
    }

    async getPdfName(req, res){
        try {
            const pdfId = req.params.pdfId;
            const pdfModel  = await PdfModel.findById(pdfId);
            return res.status(201).json({pdfName: pdfModel.originalName});
        } catch (error) {
            return res.status(400).send(error);
        }
    }
    
}

module.exports = new PdfController();