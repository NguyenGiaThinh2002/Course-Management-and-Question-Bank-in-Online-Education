const path = require("path");
const multer = require("multer");
const QAUploadModel = require("../../models/QAModel/QAUploadModel");
const PdfModel = require("../../models/QAModel/PdfModel");

const storage = multer.memoryStorage(); // Store files in memory
//const upload = multer({ storage });

// var diskStoragePath = '';
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "QAUploads/");
//   },
//   filename: (req, file, cb) => {
//     const originalname = file.originalname.replace(/\s/g, "");
//     diskStoragePath = Date.now() + "_" + originalname;
//     cb(null, diskStoragePath);
//   },
// });

const upload = multer({ storage }).fields([
  { name: "pdf", maxCount: 5 },
  { name: "word", maxCount: 5 },
  { name: "image", maxCount: 5 },
]);
const createQAFiles = async (req, res) => {
  try {
    const { folderID,pdfBuffer, originalName } = req.body;
    const file = await PdfModel.create({folderID,pdfBuffer, originalName });
    console.log("file", file);
    
    return res.status(201).json(file._id);
  } catch (error) {
    return res.status(400).send(error);
  }
};
const getQAFiles = async (req, res) => {
  try {
    const fileID = req.params.fileID;
    console.log(fileID);
    const files = await PdfModel.findById(fileID);
    return res.status(200).json(files);
  } catch (error) {
    return res.status(400).send(error);
  }
};

const getAllQAFiles = async (req, res) => {
  try {
    const folderID = req.params.folderID;
    const files = await PdfModel.find({ folderID: folderID }, { pdfBuffer: 0 });

    // Use map to create a new array without the `pdfBuffer` field
    const filesWithoutBuffer = files.map(({ _id,folderID, originalName }) => ({
      _id,
      folderID,
      originalName
    }));
    return res.status(200).json(filesWithoutBuffer);
  } catch (error) {
    return res.status(400).send(error);
  }
};

const pdfUploadMulter = async (req, res) => {
  try {
    const pdfFiles = req.files; // Assuming req.files contains the uploaded PDF files
    if (!pdfFiles || pdfFiles.length === 0) {
      return res.status(400).send('No PDF files uploaded');
    }

    // Process each PDF file
    const pdfDocuments = pdfFiles.map(file => ({
      folderID: "66c06aa180e7290c419cb794",
      filename: file.originalname,
      pdfBuffer: file.buffer, // Storing the buffer of the PDF
    }));

    // Insert multiple PDF documents into the database
    const result = await PdfModel.insertMany(pdfDocuments);

    return res.status(200).send(result);
  } catch (error) {
    console.error('Error storing PDFs:', error);
    return res.status(500).send('Error storing PDFs');
  }
};

const pdfParse = require('pdf-parse'); // For text extraction

const handleQAFileUpload = async (req, res) => {
  const folderId = req.params.folderId;
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "Error uploading files" });
    }

    const pdfFiles = req.files["pdf"] || [];
    const pdfDocuments = [];

    for (const file of pdfFiles) {
      try {
        // Extract text from PDF buffer
        // const data = await pdfParse(file.buffer);
        // const textContent = data.text;
        // console.log("textContent",textContent)
        // thinh now
        // Add the extracted text to the document object
        pdfDocuments.push({
          folderID: folderId,
          originalName: file.originalname,
          pdfBuffer: file.buffer, // Store text content only
        });
      } catch (error) {
        console.error('Error processing PDF file:', error);
        return res.status(500).json({ error: "Error processing PDF files" });
      }
    }

    try {
      const result = await PdfModel.insertMany(pdfDocuments);

      const pdfUrls = pdfFiles.map((file) => QAUploadModel.getUploadedPdfUrl(file.filename));
      const Originalname = pdfFiles.map((file) => file.originalname);

      res.status(200).json({
        message: "Files uploaded and processed successfully",
        pdfUrls,
        Originalname,
      });
    } catch (error) {
      console.error('Error storing PDF in MongoDB:', error);
      res.status(500).send('Error storing PDF');
    }
  });
};

    // // Process Word documents
    // const wordFiles = req.files["word"] || [];
    // const wordUrls = wordFiles.map((file) =>
    //     QAUploadModel.getUploadedWordUrl(file.filename)
    // );

    // // Process images
    // const imageFiles = req.files["image"] || [];
    // const imageUrls = imageFiles.map((file) =>
    //     QAUploadModel.getUploadedImageUrl(file.filename)
    // );

    // You can return the other file types as well if needed


//  const handleQAFileUpload = (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(500).json({ error: "Error uploading files" });
//     }

//     const pdfFiles = req.files["pdf"] || [];
//     const pdfUrls = pdfFiles.map((file) =>
//         QAUploadModel.getUploadedPdfUrl(file.filename)
//     );
  
//     try {
  
//       res.status(200).send(`PDF stored successfully with ID: ${result.insertedId}`);
//     } catch (error) {
//       console.error('Error storing PDF in MongoDB:', error);
//       res.status(500).send('Error storing PDF');
//     }

//     // Process Word documents
//     const wordFiles = req.files["word"] || [];
//     const wordUrls = wordFiles.map((file) =>
//         QAUploadModel.getUploadedWordUrl(file.filename)
//     );

//     // Process images
//     const imageFiles = req.files["image"] || [];
//     const imageUrls = imageFiles.map((file) =>
//         QAUploadModel.getUploadedImageUrl(file.filename)
//     );

//     // Get original filenames
//     const Originalname = [].concat(
//       pdfFiles.map((file) => file.originalname),
//       wordFiles.map((file) => file.originalname),
//       imageFiles.map((file) => file.originalname)
//     );

//     res.status(200).json({
//       message: "Files uploaded successfully",
//       pdfUrls,
//       wordUrls,
//       imageUrls,
//       Originalname,
//       diskStoragePath
//     });
//   });
// };

module.exports = { handleQAFileUpload, createQAFiles, getQAFiles ,getAllQAFiles , pdfUploadMulter};