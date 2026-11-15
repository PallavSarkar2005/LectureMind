
const express = require("express");
const multer = require("multer");
const path = require("path");

const { uploadPdf } = require("../controllers/pdf.controller");

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    // Debug information
    console.log("Original filename:", file.originalname);
    console.log("MIME type:", file.mimetype);

    const extension = path.extname(file.originalname).toLowerCase();

    console.log("Detected extension:", extension);

    if (
      extension === ".pdf" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

router.post("/upload", upload.single("pdf"), uploadPdf);

module.exports = router;
