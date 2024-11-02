// models/uploadModel.js
const path = require('path');

const getUploadedPdfUrl = (filename) => {
  return `http://localhost:3000/uploads/${filename}`;
};

module.exports = { getUploadedPdfUrl };
