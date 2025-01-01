const User = require("../models/User");

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, number, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("User already exists");
    }

    // Create a new user
    const newUser = new User({ name, email, number, password });

    // Save the user to the database
    await newUser.save();

    res.status(201).json("User registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
};

module.exports = { registerUser };
