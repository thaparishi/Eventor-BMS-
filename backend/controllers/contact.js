import contactSchema from "../models/contact.js";

export const createContact = async (req, res) => {
  try {
    console.log(req.body);
    await contactSchema.create({ ...req.body });
    res.json("successful");
  } catch (error) {
    console.log(error);
  }
};