// Importing models
import bookedSchema from "../models/book.js";
import registerModel from "../models/register.js";

// Importing bcrypt to hash the password.
import bcrypt from "bcryptjs";

// Importing nodemailer for sending mail.
import nodemailer from "nodemailer";

// Importing jwt to create a token.
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
    res.status(500).json({ error: "Server error" });
  }
};

const createReservation = async (req, res) => {
  try {
    const { shift, date, guest, type } = req.body;
    if (shift && date && guest && type) {
      // Creating a token.
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
    res.status(500).json({ error: "Server error" });
  }
};

const bookBanquet = async (req, res) => {
  try {
    // Destructuring the object.
    const { token, banquetName, adminUserId, price } = req.params;
    console.log(price);
    // Decoding the token with secret key and token.
    let decoded = await jwt.verify(token, "jwtsecret");

    const { userId, shift, date, guest, type } = decoded;

    const { breakfast, lunch, desert } = req.body;

    if (breakfast.length > 0 && lunch.length > 0 && desert.length > 0) {
      const booking = await bookedSchema.create({
        bookUserId: userId,
        banquetName: banquetName,
        shift: shift,
        date: date,
        guest: guest,
        type: type,
        starters: breakfast,
        mainCourse: lunch,
        desert: desert,
        status: "booked",
        paymentStatus: "pending"
      });

      const createdBanquetData = await registerModel.findOne({
        userId: adminUserId,
      });

      const adminData = await registerModel.findOne({ userId: userId });

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
        to: [`${adminData.email}, ${createdBanquetData?.email || process.env.EMAIL}`],
        subject: " The Banquet is Booked Successfully",
        html: `<h3>Hello sir, The ${banquetName} is booked on ${date}. Further Details are Below. </h3>
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

      // Sending message to user email for verification.
      transporter.sendMail(mailConfiguration, function (error, info) {
        // If not successful.
        if (error) {
          console.log("Email sending error:", error);
        }
        // If successful.
        console.log("Sent: " + info.response);
      });

      return res.json("Sucess");
    }
    res.json("Unsucessfull");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Function to check if a banquet is available on a specific date and shift
const checkBanquetAvailability = async (req, res) => {
  try {
    const { banquetId, date, shift } = req.params;
    
    if (!banquetId || !date || !shift) {
      return res.status(400).json({ 
        isAvailable: false, 
        message: "Missing required parameters" 
      });
    }

    // Find existing bookings for this banquet on the selected date and shift
    const existingBookings = await bookedSchema.find({
      banquetName: banquetId, // Using banquetId as the name, adjust if needed
      date: { $elemMatch: { $eq: date } },
      shift: shift,
      status: { $ne: "cancelled" } // Exclude cancelled bookings
    });

    // If there are any bookings that match and they're not cancelled, the banquet is unavailable
    if (existingBookings && existingBookings.length > 0) {
      // Get the type of event that's already booked
      const existingEventType = existingBookings[0].type && existingBookings[0].type.length > 0 
        ? existingBookings[0].type[0] 
        : "event";
      
      return res.json({
        isAvailable: false,
        message: `This banquet is already booked for a ${existingEventType} on this date and shift.`
      });
    }

    // If no conflicting bookings found, the banquet is available
    return res.json({
      isAvailable: true
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      isAvailable: false, 
      message: "Server error while checking availability" 
    });
  }
};

// New function to update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await bookedSchema.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    
    // Update payment status to paid and booking status to confirmed
    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    await booking.save();
    
    res.status(200).json({ success: true, message: "Payment confirmed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// New function to cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.signedCookies.userId;
    
    const booking = await bookedSchema.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    
    // Check if the booking belongs to the current user
    if (booking.bookUserId !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized to cancel this booking" });
    }
    
    // Don't allow cancellation if the booking is already confirmed (payment completed)
    if (booking.status === "confirmed" && booking.paymentStatus === "paid") {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot cancel a confirmed booking. Please contact customer support." 
      });
    }
    
    // Update booking status to cancelled
    booking.status = "cancelled";
    await booking.save();
    
    // Send cancellation email
    const adminData = await registerModel.findOne({ userId: booking.bookUserId });
    
    // Creating a medium to send email.
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.PASSWORD}`,
      },
    });

    // Contents of email.
    let mailConfiguration = await transporter.sendMail({
      from: `${process.env.EMAIL}`,
      to: `${adminData.email}`,
      subject: "Booking Cancellation Confirmation",
      html: `<h3>Hello ${adminData.name}, Your booking for ${booking.banquetName} has been cancelled.</h3>
       <p>
       Booking Details:
       <br>
       Banquet Name: ${booking.banquetName}
       <br>
       Date: ${booking.date}
       <br>
       Event Type: ${booking.type}
       <br>
       </p>
       <p>If you did not request this cancellation, please contact our customer support immediately.</p>`,
    });

    // Sending message to user email for verification.
    transporter.sendMail(mailConfiguration, function (error, info) {
      if (error) {
        console.log("Email sending error:", error);
      }
      console.log("Sent: " + info.response);
    });
    
    res.status(200).json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// New function to get user bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.signedCookies.userId;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    
    const bookings = await bookedSchema.find({ bookUserId: userId })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .lean();
    
    // Transform the data into a more frontend-friendly format
    const formattedBookings = bookings.map(booking => {
      return {
        _id: booking._id,
        banquetName: booking.banquetName,
        date: booking.date[0], // Get the first (and only) date
        eventType: booking.type[0], // Get the first (and only) type
        guests: booking.guest[0], // Get the first (and only) guest count
        shift: booking.shift,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        starters: booking.starters,
        mainCourse: booking.mainCourse,
        desert: booking.desert,
        createdAt: booking.createdAt
      };
    });
    
    res.status(200).json({ success: true, bookings: formattedBookings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { 
  filterBanquet, 
  bookBanquet, 
  createReservation,
  updatePaymentStatus,
  cancelBooking,
  getUserBookings,
  checkBanquetAvailability
};