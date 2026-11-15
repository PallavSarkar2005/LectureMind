
const { extractPdfText } = require("../services/pdf.service");

const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file"
      });
    }

    const extractedText = await extractPdfText(req.file.buffer);

    if (!extractedText.trim()) {
      return res.status(400).json({
        success: false,
        message: "No readable text found in PDF"
      });
    }

    res.status(200).json({
      success: true,
      message: "PDF uploaded successfully",
      text: extractedText
    });

  } catch (error) {
    console.error("PDF upload error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process PDF"
    });
  }
};

module.exports = { uploadPdf };
