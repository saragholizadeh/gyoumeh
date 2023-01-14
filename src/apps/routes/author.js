const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const controller = require("../controllers/author");

//Setting storage engine
const storageEngine = multer.diskStorage({
  destination: "./public/storage/images/posts",
  filename: (req, file, cb) => {
    const format = file.originalname.split(".");

    cb(null, `${(new Date().getTime())}.${format[format.length - 1]}`);
  },
});

const checkFileType = function (file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|svg/; //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Only Upload Images!!");
  }
};

const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

//add a middleware for check if user is login or not
router.get("/create", controller.create);
router.post("/create", upload.single("upload_file"), controller.post);

module.exports = router;
