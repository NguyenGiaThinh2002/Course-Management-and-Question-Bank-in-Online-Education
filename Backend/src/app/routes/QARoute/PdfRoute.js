const express = require('express')
const router = express.Router();
const pdfController = require('../../controllers/QAControllers/PdfController')

router.post('/createPdf', pdfController.createPdf);
router.get('/getPdfName/:pdfId', pdfController.getPdfName);


module.exports = router;