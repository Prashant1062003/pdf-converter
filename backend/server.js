const express = require("express");
const multer = require("multer");
const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const jwt = require("jsonwebtoken");

const app = express();
const upload = multer({ dest: "uploads/" });

// Configure AWS S3
const s3 = new S3Client({
  region: 'YOUR_AWS_REGION', // e.g., 'us-east-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Upload file to AWS S3
const uploadToS3 = async (fileContent, fileName) => {
  const params = {
    Bucket: "YOUR_BUCKET_NAME",
    Key: fileName,
    Body: fileContent,
  };

  const command = new PutObjectCommand(params);
  return s3.send(command);
};

// Middleware to check JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Convert route
app.post("/convert", authenticateToken, upload.single("file"), async (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const format = req.body.format;

  let convertedData;

  try {
    if (format === "docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      convertedData = result.value;
    } else if (format === "txt") {
      const pdfText = await extractTextFromPDF(filePath);
      convertedData = pdfText;
    }

    // Upload the converted file to AWS S3
    const fileContent = Buffer.from(convertedData, "utf8");
    await uploadToS3(fileContent, `converted.${format}`);
    
    res.send(convertedData);
  } catch (error) {
    res.status(500).send("Error during file conversion");
  } finally {
    fs.unlinkSync(filePath); // Cleanup
  }
});

const extractTextFromPDF = async (filePath) => {
  // Logic to extract text from PDF (use libraries like `pdf-lib` or others)
  return "Extracted Text";
};

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
