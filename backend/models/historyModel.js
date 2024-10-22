// models/historyModel.js
const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  format: { type: String, required: true },
  downloadUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("History", historySchema);
