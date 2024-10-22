// routes/fileRoutes.js
const express = require("express");
const { upload, convert } = require("../controllers/fileController");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.post("/convert", authenticateToken, upload.single("file"), convert);

module.exports = router;
