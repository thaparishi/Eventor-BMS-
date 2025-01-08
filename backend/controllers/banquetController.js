const Banquet = require("../models/Banquet");

const registerBanquet = async (req, res) => {
  const { name, location, contact, capacity, price, description } = req.body;

  try {
    const newBanquet = new Banquet({
      name,
      location,
      contact,
      capacity,
      price,
      description,
    });

    await newBanquet.save();

    res.status(201).json({ success: true, message: "Banquet registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { registerBanquet };