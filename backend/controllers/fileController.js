// controllers/fileController.js
const multer = require("multer");
const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");
const s3 = require("../config/awsConfig");
const pdf = require("pdf-parse");

const upload = multer({ dest: "uploads/" });

// Upload file to AWS S3
const uploadToS3 = async (fileContent, fileName) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
  };
  return s3.upload(params).promise();
};

// Middleware to handle file uploads and conversions
const convert = async (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.file.filename);
  const format = req.body.format;
  let convertedData;

  try {
    if (format === "docx") {
      const result = await mammoth.convertToHtml({ path: filePath });
      convertedData = result.value; // HTML or plain text
    } else if (format === "txt") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      convertedData = data.text;
    }
    // Upload the converted file to AWS S3
    const fileContent = Buffer.from(convertedData, "utf8");
    await uploadToS3(fileContent, `converted.${format}`);

    res.status(200).json({ message: "File converted successfully", downloadUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/converted.${format}` });
  } catch (error) {
    console.error("Error during file conversion:", error);
    res.status(500).send("Error during file conversion");
  } finally {
    // Cleanup: remove the uploaded file after processing
    fs.unlinkSync(filePath);
  }
};

module.exports = { upload, convert };
