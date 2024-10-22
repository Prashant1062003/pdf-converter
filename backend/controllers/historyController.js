// controllers/historyController.js
const History = require("../models/historyModel");

const saveHistory = async (data) => {
  const history = new History(data);
  await history.save();
};

const getHistory = async (req, res) => {
  try {
    const history = await History.find();
    res.status(200).json(history);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { saveHistory, getHistory };
