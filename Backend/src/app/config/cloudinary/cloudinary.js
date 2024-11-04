const cloudinary = require('cloudinary').v2;

cloudinary.config({
     cloudName: "",
     presetName: "",
     folderName: "",
     api: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
});

module.exports = cloudinary;
