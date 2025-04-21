import banquetModel from "../models/banquet.js";
import registerModel from "../models/register.js";
import BanquetOwnerModel from "../models/banquetowner.js";
import nodemailer from "nodemailer";
import menuSchema from "../models/menu.js";
import jwt from "jsonwebtoken";
import { generatePassword } from "../utils/passwordGenerator.js";

export const createMenu = async (req, res) => {
  try {
    // Destructuring array.
    const [breakfast, dinner, desert, price] = req.body.menu;
    const { token } = req.params;
    
    // Decoding the token with secret key and token.
    let decoded;
    try {
      decoded = await jwt.verify(token, "jwtsecret");
    } catch (tokenError) {
      console.log("Token verification error:", tokenError);
      return res.status(401).json({ error: "Invalid token" });
    }
    
    if (breakfast && dinner && desert && price) {
      // Creating banquet.
      const {
        userId,
        banquet_name,
        banquet_description,
        banquet_location,
        banquet_price,
        image_location
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
      
      const userData = await registerModel.findOne({
        userId: req.signedCookies.userId,
      });

      // Check if a BanquetOwner account with this email already exists
      const existingOwner = await BanquetOwnerModel.findOne({ email: userData.email });
      let generatedPassword;
      
      // Only create a new BanquetOwner if one doesn't already exist
      if (!existingOwner) {
        // Generate a random password
        generatedPassword = generatePassword(10);
        
        // Create BanquetOwner account
        const banquetOwner = await BanquetOwnerModel.create({
          email: userData.email,
          password: generatedPassword, // This will be hashed by the pre-save hook
          userId: req.signedCookies.userId,
          name: userData.name
        });
      } else {
        console.log(`BanquetOwner with email ${userData.email} already exists, skipping account creation`);
      }

      // Creating a medium to send email.
      let transporter = nodemailer.createTransport({
        // Domain name.
        service: "gmail",
        auth: {
          user: `${process.env.EMAIL}`,
          pass: `${process.env.PASSWORD}`,
        },
      });

      // Contents of email.
      let mailConfiguration = await transporter.sendMail({
        from: `${process.env.EMAIL}`,
        to: `${userData.email}`,
        subject: "Banquet Created: Welcome to our Banquet System",
        html: `<h3>Hello ${userData.name}, Thanks for promoting your banquet on our platform!</h3>
        <p>
        <strong>Your Banquet Details:</strong><br>
        Banquet Name: ${banquet_name}<br>
        Banquet Description: ${banquet_description}<br>
        Location: ${banquet_location}<br>
        Banquet Price Per Plate: ${banquet_price}<br>
        Available Starters: ${breakfast}<br>
        Available MainCourse: ${dinner}<br>
        Available Desert: ${desert}<br>
        </p>
        <p>
        <strong>Your Admin Dashboard Access:</strong><br>
        You can now access your banquet management dashboard with the following credentials:<br>
        URL: <a href="http://localhost:8000/admin">Admin Dashboard</a><br>
        Email: ${userData.email}<br>
        ${existingOwner ? 'Please use your existing password to login.' : `Password: ${generatedPassword}`}<br>
        </p>
        <p><strong>Note:</strong> Please keep your credentials safe. You have limited access to manage only your banquet and menu details.</p>`,
      });

      // Sending message to user email for verification.
      transporter.sendMail(mailConfiguration, function (error, info) {
        // If not successful.
        if (error) {
          console.log("Email sending failed:", error);
        }
        // If successful.
        console.log("Sent: " + info.response);
      });
      
      return res.status(200).json("Sucess");
    }
    return res.status(400).json("Unsucessfull");
  } catch (error) {
    console.log("Error in createMenu:", error);
    res.status(500).json({ error: "An error occurred while creating the menu" });
  }
};

export const getMenu = async (req, res) => {
  try {
    const { banquetId, token } = req.params;
    console.log(`Getting menu for banquetId: ${banquetId}, token: ${token}`);

    if (!banquetId || !token) {
      return res.status(400).json({ 
        error: "Missing required parameters",
        data: {
          userId: "admin",
          breakfast: [],
          dinner: [],
          desert: []
        },
        price: 0
      });
    }

    // Decoding the token with secret key and token.
    let decoded;
    try {
      decoded = await jwt.verify(token, "jwtsecret");
    } catch (tokenError) {
      console.log("Token verification error:", tokenError);
      return res.status(401).json({ 
        error: "Invalid token",
        data: {
          userId: "admin",
          breakfast: [],
          dinner: [],
          desert: []
        },
        price: 0
      });
    }

    const { guest } = decoded;
    const newPrice = parseInt(guest) || 0;

    // Find menu for the provided banquet ID
    const menu = await menuSchema.findOne({ banquetId: banquetId });
    console.log("Menu found:", menu);

    // Always return a properly structured response
    if (menu) {
      // Return actual menu data
      return res.status(200).json({ 
        data: {
          userId: menu.userId,
          breakfast: menu.breakfast || [],
          dinner: menu.dinner || [],
          desert: menu.desert || []
        }, 
        price: newPrice 
      });
    } else {
      // Return empty menu structure with default values
      console.log("No menu found for banquetId:", banquetId);
      return res.status(200).json({ 
        data: {
          userId: "admin",
          breakfast: [],
          dinner: [],
          desert: []
        }, 
        price: newPrice 
      });
    }
  } catch (error) {
    console.log("Error in getMenu:", error);
    return res.status(500).json({ 
      error: "Failed to retrieve menu",
      data: {
        userId: "admin",
        breakfast: [],
        dinner: [],
        desert: []
      },
      price: 0
    });
  }
};