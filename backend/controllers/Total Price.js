import banquetModel from "../models/banquet.js";
import menuSchema from "../models/menu.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createMenu = async (req, res) => {
  try {
    // Destructuring array.
    const [breakfast, dinner, desert, price] = req.body.menu;
    const { token } = req.params;
    // Decoding the token with secret key and token.
    let decoded = await jwt.verify(token, "jwtsecret");
    console.log(decoded);
    if (breakfast && dinner && desert && price) {
      // Creating banquet.
      const createBanquet = await banquetModel.create({
        ...decoded,
      });
      // Creating menu.
      await menuSchema.create({
        userId: req.signedCookies.userId,
        banquetId: createBanquet._id,
        breakfast,
        dinner,
        desert,
        price,
      });
      return res.status(200).json("Sucess");
    }
    res.json("Unsucessfull");
  } catch (error) {
    console.log(error);
  }
};

export const getMenu = async (req, res) => {
  try {
    const { banquetId } = req.params;
    const menu = await menuSchema.findOne({ banquetId: banquetId });
    res.status(200).json(menu);
  } catch (error) {
    console.log(error);
  }
};