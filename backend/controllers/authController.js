const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Handle user registration
const registerUser = async (req, res) => {
  const { name, email, number, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("User already exists");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ name, email, number, password: hashedPassword });
    await newUser.save();

    res.status(201).json("User registered successfully");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json("Server error");
  }
};

// Handle user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("Unsucessfull"); // User not found
    }

    // Compare the provided password with the stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json("Unsucessfull"); // Incorrect password
    }

    // If the credentials are correct, send success response
    res.status(200).json("Sucess");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json("Server error");
  }
};

module.exports = { registerUser, loginUser };
