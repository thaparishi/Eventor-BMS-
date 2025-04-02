import banquetModel from "../models/banquet.js";
import registerModel from "../models/register.js";
import nodemailer from "nodemailer";
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
      const {
        banquet_name,
        banquet_description,
        banquet_location,
        banquet_price,
      } = decoded;
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
      const adminData = await registerModel.findOne({
        userId: req.signedCookies.userId,
      });

      // // Sending email to created banquet person.

       // Creating a medium to send email.
       let transporter = nodemailer.createTransport({
         // Domain name.
         service: "gmail",
         auth: {
         // Your email
           user: `${process.env.EMAIL}`,
           // Your password
           pass: `${process.env.PASSWORD}`,
         },
       });

       // Contents of email.
       let mailConfiguration = await transporter.sendMail({
         from: `${process.env.EMAIL}`,
         to: `${adminData.email}`,
         subject: "Banquet Created: Welcome to our Banquet System",
         html: `<h3>Hello There, Thanks for promoting you platform with following details.</h3>
         <p>
         Banquet Name: ${banquet_name}
         <br>
         Banquet Description: ${banquet_description}
         <br>
         Location: ${banquet_location}
         <br>
         Banquet Price Per Plate: ${banquet_price}
         <br>
         Available Starters: ${breakfast}
         <br>
       Available MainCourse: ${dinner}
         <br>
         Availabe Desert: ${desert}
         <br>
         </p>`,
       });

       // Sending message to user email for verification.
       transporter.sendMail(mailConfiguration, function (error, info) {
         // If not successful.
      if (error) {
           throw new CustomAPIError("Email not send");
         }
         // If successful.
         console.log("Sent: " + info.response);
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
    const { banquetId, token } = req.params;

    // Decoding the token with secret key and token.
    let decoded = await jwt.verify(token, "jwtsecret");

    const { guest } = decoded;

    const menu = await menuSchema.findOne({ banquetId: banquetId });

    const newPrice = parseInt(guest);

    res.status(200).json({ data: menu, price: newPrice });
  } catch (error) {
    console.log(error);
  }
};