// // controllers/uploadController.js
// const path = require('path')
// const multer = require('multer');
// const uploadModel = require('../models/uploadModel');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
// filename: (req, file, cb) => {
//     const originalname = file.originalname.replace(/\s/g, ''); // Remove spaces from the original filename
//     cb(null, Date.now() + '_' + originalname); // Prefix the timestamp to avoid conflicts
//   },
// });

// const upload = multer({ storage }).array('pdf', 5);
// const handleFileUpload = (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(500).json({ error: 'Error uploading files' });
//     }
//     Originalname = req.files.map((file) => file.originalname);
//     const pdfUrls = req.files.map((file) => uploadModel.getUploadedPdfUrl(file.filename));
//     res.status(200).json({ message: 'Files uploaded successfully', pdfUrls, Originalname });
//   });
// };

// module.exports = { handleFileUpload };

// controllers/uploadController.js
const path = require("path");
const multer = require("multer");
const uploadModel = require("../models/uploadModel");
const File = require("../models/Files");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const originalname = file.originalname.replace(/\s/g, "");
    cb(null, Date.now() + "_" + originalname);
  },
});

const upload = multer({ storage }).fields([
  { name: "pdf", maxCount: 5 },
  { name: "word", maxCount: 5 },
  { name: "image", maxCount: 5 },
]);
const createFiles = async (req, res) => {
  try {
    const { originalName, path } = req.body;
    const file = await File.create({ originalName, path });
    return res.status(201).json(file);
  } catch (error) {
    return res.status(400).send(error);
  }
};
const getFiles = async (req, res) => {
  try {
    const fileID = req.params.fileID;
    console.log(fileID);
    const files = await File.findById(fileID);
    return res.status(200).json(files);
  } catch (error) {
    return res.status(400).send(error);
  }
};

const getAllFiles = async (req, res) => {
  try {
    const files = await File.find();
    return res.status(200).json(files);
  } catch (error) {
    return res.status(400).send(error);
  }
};

const handleFileUpload = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: "Error uploading files" });
    }

    // Process PDFs
    const pdfFiles = req.files["pdf"] || [];
    const pdfUrls = pdfFiles.map((file) =>
      uploadModel.getUploadedPdfUrl(file.filename)
    );

    // Process Word documents
    const wordFiles = req.files["word"] || [];
    const wordUrls = wordFiles.map((file) =>
      uploadModel.getUploadedWordUrl(file.filename)
    );

    // Process images
    const imageFiles = req.files["image"] || [];
    const imageUrls = imageFiles.map((file) =>
      uploadModel.getUploadedImageUrl(file.filename)
    );

    // Get original filenames
    const Originalname = [].concat(
      pdfFiles.map((file) => file.originalname),
      wordFiles.map((file) => file.originalname),
      imageFiles.map((file) => file.originalname)
    );

    res.status(200).json({
      message: "Files uploaded successfully",
      pdfUrls,
      wordUrls,
      imageUrls,
      Originalname,
    });
  });
};

module.exports = { handleFileUpload, createFiles, getFiles ,getAllFiles };
