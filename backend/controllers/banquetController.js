const Banquet = require("../models/Banquet");

// Register a new banquet
const registerBanquet = async (req, res) => {
  const { name, location, contact, capacity, price, description } = req.body;

  try {
    // Create a new banquet
    const newBanquet = new Banquet({ name, location, contact, capacity, price, description });

    // Save the banquet to the database
    await newBanquet.save();

    res.status(201).json({ success: true, message: "Banquet registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { registerBanquet };
