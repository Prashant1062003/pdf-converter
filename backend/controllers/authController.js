// controllers/authController.js
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// User signup
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const user = new User({ name, email, password });
  try {
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// User login
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.status(200).json({ token });
};

module.exports = { signup, login };
