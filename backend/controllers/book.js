//Importing models
import bookedSchema from "../models/book.js";
import registerModel from "../models/register.js";

//Importing bcrypt to hash the password.
import bcrypt from "bcryptjs";

//Importing nodemailer for sending mail.
import nodemailer from "nodemailer";

//Importing jwt to create a token.
import jwt from "jsonwebtoken";

const filterBanquet = async (req, res) => {
  try {
    const { shift, date, guest, type } = req.body;
    console.log(shift, date, guest, type);
    if (shift == null || date == null || guest == null || type == null) {
      return res.send("Please fill the values");
    }

    res.redirect("http://localhost:3000/banquet");
  } catch (error) {
    console.log(error);
  }
};

const createReservation = async (req, res) => {
  try {
    const { shift, date, guest, type } = req.body;
    if (shift && date && guest && type) {
      //Creating a token.
      const token = jwt.sign(
        { userId: req.signedCookies.userId, shift, date, guest, type },
        "jwtsecret",
        {
          expiresIn: "200000s",
        }
      );
      return res.json({ data: token, Sucess: "Sucess" });
    }
    res.json({ Sucess: "Unsucessfull" });
  } catch (error) {
    console.log(error);
  }
};

const bookBanquet = async (req, res) => {
  try {
    //Destructuring the object.
    const { token, banquetName, adminUserId, price } = req.params;
    console.log(price);
    //Decoding the token with secret key and token.
    let decoded = await jwt.verify(token, "jwtsecret");

    const { userId, shift, date, guest, type } = decoded;

    const { breakfast, lunch, desert } = req.body;

    if (breakfast.length > 0 && lunch.length > 0 && desert.length > 0) {
      await bookedSchema.create({
        bookUserId: userId,
        banquetName: banquetName,
        shift: shift,
        date: date,
        guest: guest,
        type: type,
        starters: breakfast,
        mainCourse: lunch,
        desert: desert,
      });

      const createdBanquetData = await registerModel.findOne({
        userId: adminUserId,
      });

      const adminData = await registerModel.findOne({ userId: userId });

      //Sending email to created banquet person.

       //Creating a medium to send email.
       let transporter = nodemailer.createTransport({
         //Domain name.
         service: "gmail",
      auth: {
          //Your email
          user: `${process.env.EMAIL}`,
         //Your password
           pass: `${process.env.PASSWORD}`,
         },
       });

       //Contents of email.
       let mailConfiguration = await transporter.sendMail({
         from: `${process.env.EMAIL}`,
        to: [`${adminData.email}, ${createdBanquetData.email}`],
         subject: " The Banquet is Booked Succesfully",
         html: `<h3>Hello sir, The  ${banquetName} is booked  on ${date}. Further Details are Below. </h3>
         <p>
        BanquetName: ${banquetName}
         <br>
         Shift: ${shift}
         <br>
         Date: ${date}
         <br>
         Guest: ${guest}
         <br>
         Type: ${type}
         <br>
         Starters: ${breakfast}
         <br>
        Main Course: ${lunch}
        <br>
         Desert: ${desert}
        <br>
         Total Cost of Event : ${price}
        <br>
         </p>`,
       });

       //Sending message to user email for verification.
       transporter.sendMail(mailConfiguration, function (error, info) {
        //If not successful.
         if (error) {
           throw new CustomAPIError("Email not send");
         }
         //If successful.
         console.log("Sent: " + info.response);
       });

      return res.json("Sucess");
    }
    res.json("Unsucessfull");
  } catch (error) {
    console.log(error);
  }
};

export { filterBanquet, bookBanquet, createReservation };