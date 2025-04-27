// Importing register schema from models folder.
import registerModel from "../models/register.js";

// Importing uuid for generating unique IDs.
import { v4 as uuidv4 } from "uuid";

// Importing bcrypt to hash the password.
import bcrypt from "bcryptjs";

// Importing jwt to create a token.
import jwt from "jsonwebtoken";

// Importing nodemailer for sending mail.
import nodemailer from "nodemailer";

// Import BookModel for getUserBookings function
import BookModel from "../models/book.js";

const register = async (req, res) => {
  try {
    // Destructuring the object.check
    const { name, email, number, password } = req.body;

    // Creating user id.
    const uid = uuidv4();

    if (name && email && number && password && uid) {
      // Hashing the password.
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      // Creating a token.
      const token = jwt.sign(
        { userId: uid, name, email, number, password: hash },
        "jwtsecret",
        {
          expiresIn: "120s",
        }
      );

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
        to: `${email}`,
        subject: "Email verifications",
        html: `<h3>Hi! Thank you for creating your account on our website.
      <br>
      Please follow the given link to verify your email
      http://localhost:8000/api/verify/${token}
      <br>
      Thanks and Kind Regards, Banquet Reservation Team</h3>`,
      });

      // Sending message to user email for verification.
      transporter.sendMail(mailConfiguration, function (error, info) {
        // If not successful.
        if (error) {
          throw new Error("Email not sent");
        }
        // If successful.
        console.log("Sent: " + info.response);

        return res.json("Successful");
      });
      return res.json("Success");
    }
    res.json("Unsuccessful");
  } catch (error) {
    console.log(error);
  }
};

const verify = async (req, res) => {
  try {
    // Decoding the token with secret key and token.
    let decoded = await jwt.verify(req.params.id, "jwtsecret");

    res.cookie("signedIn", true);

    // Storing decoded value in database.
    await registerModel.create({ ...decoded });

    res.redirect(`http://localhost:3000/login`);
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkEmail = await registerModel.findOne({ email });

    if (!checkEmail) {
      return res.json("Unsuccessful");
    }

    const checkIfPassMatch = await bcrypt.compare(password, checkEmail.password);

    if (checkIfPassMatch) {
      const { userId } = checkEmail;

      // In the login controller, modify cookie settings:
      res.cookie("signedIn", true, {
        maxAge: 150000000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // Change from 'strict' to 'lax'
        signed: true
      });

      res.cookie("userId", userId, {
        maxAge: 150000000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // Change from 'strict' to 'lax'
        signed: true
      });

      return res.json("Success");
    }
    res.json("Unsuccessful");
  } catch (error) {
    console.log(error);
  }
};

const sendResetPasswordLink = async (req, res) => {
  try {
    // Destructuring the object.
    const { email } = req.body;

    console.log(req.body);

    // Searching for email in the database.
    const checkEmail = await registerModel.findOne({ email });

    // Checking if email exists in the database.
    if (!checkEmail) {
      console.log(checkEmail);
      return res.json("Unsuccessful");
    }

    // Creating a token using json web token.
    const token = jwt.sign({ email }, "jwtsecret", {
      expiresIn: "120s",
    });

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
      to: `${email}`,
      subject: "Password Reset ",
      html: `<h3>Hi! In order to change Password please click on link below
      <br>
    	Please follow the given link to reset the password
    	http://localhost:8000/api/verifyEmail/${token}
      <br>
    	Thank you and Kind Regards, Eventor Team</h3>`,
    });

    // Sending message to user email for verification.
    transporter.sendMail(mailConfiguration, function (error, info) {
      // If not successful.
      if (error) {
        console.log("ERROR" + error);
      }
      // If successful.
      console.log("Sent: " + info.response);
    });
    res.json("Success");
  } catch (error) {
    console.log(error);
  }
};

const checkLoginCookie = async (req, res) => {
  try {
    const { signedIn, userId } = req.signedCookies;

    if (signedIn === "true") {
      return res.json({ success: true, userId: userId });
    }

    res.json({ success: false });
  } catch (error) {
    console.log(error);
  }
};

const deleteLoginCookie = async (req, res) => {
  try {
    res.clearCookie("signedIn", {
      path: '/',
      domain: 'localhost',
      httpOnly: true,
      secure: false, // Match cookie creation settings
      sameSite: 'lax'
    });
    
    res.clearCookie("userId", {
      path: '/',
      domain: 'localhost',
      httpOnly: true,
      secure: false, // Match cookie creation settings
      sameSite: 'lax'
    });

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

const verifyEmail = async (req, res) => {
  try {
    // Destructuring the object.
    const { id } = req.params;

    // Decoding the email.
    const { email } = await jwt.verify(id, "jwtsecret");

    // Searching for email in the database.
    const checkEmail = await registerModel.findOne({ email });

    // Checking if email exists in the database.
    if (!checkEmail) {
      return res.send("Sorry no email found");
    }
    res.redirect(`http://localhost:3000/changePassword/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
};

const changePassword = async (req, res) => {
  try {
    // Decoding the email received from req.params.
    let { email } = await jwt.verify(req.body.email, "jwtsecret");
    // Finding the email.
    const getUserData = await registerModel.findOne({ email });

    if (getUserData) {
      // Generating the salt.
      const salt = await bcrypt.genSalt(10);
      // Hashing the password.
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      await registerModel.findOneAndUpdate(
        { email },
        {
          password: hashedPassword,
        }
      );

      return res.json({ success: true });
    }
    res.send("No Email Found in Database");
  } catch (error) {
    console.log(error);
  }
};

// Get user profile data
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.signedCookies;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    const user = await registerModel.findOne({ userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    // Return user data without sensitive information
    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        number: user.number
      }
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.signedCookies;
    const { name, email, number, currentPassword, newPassword } = req.body;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    
    const user = await registerModel.findOne({ userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const updateData = {};
    
    // Update name if provided
    if (name && name !== user.name) {
      updateData.name = name;
    }
    
    // Update number if provided
    if (number && number !== user.number) {
      updateData.number = number;
    }
    
    // Update email if it's different
    if (email && email !== user.email) {
      // Check if the new email is already in use
      const emailExists = await registerModel.findOne({ email, userId: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({ success: false, message: "Email is already in use" });
      }
      updateData.email = email;
    }
    
    // Update password if provided
    if (newPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ success: false, message: "Current password is incorrect" });
      }
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }
    
    // Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      await registerModel.findOneAndUpdate({ userId }, updateData);
    }
    
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.signedCookies;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    
    // Find bookings for the user
    const bookings = await BookModel.find({ userId })
      .sort({ createdAt: -1 }) // Most recent first
      .populate('banquetId', 'name'); // Get banquet name
    
    // Format the bookings for the frontend
    const formattedBookings = bookings.map(booking => ({
      _id: booking._id,
      banquetName: booking.banquetId ? booking.banquetId.name : 'Unknown Venue',
      date: booking.date,
      eventType: booking.eventType,
      guests: booking.guests,
      status: booking.status,
      totalAmount: booking.totalAmount,
      createdAt: booking.createdAt
    }));
    
    res.json({ success: true, bookings: formattedBookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Exporting all functions
export {
  register,
  verify,
  login,
  sendResetPasswordLink,
  verifyEmail,
  changePassword,
  checkLoginCookie,
  deleteLoginCookie,
  getUserProfile,
  updateUserProfile,
  getUserBookings
};