const MB = 1000000;
const multer = require("multer");
const path = require("path");
const { FileHash } = require("./hashing");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  filename: (req, file, cb) => {
    cb(null, FileHash(file.originalname));
  },
});

const newsRoomFileUpload = multer({
  storage,
  limits: { fileSize: 10 * MB },
}).array("imageList");



module.exports = { 
  newsRoomFileUpload,
};
