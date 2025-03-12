import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";

// Importing custom modules
import connectDB from "./db/connect.js";
import authRoutes from "./routes/auth.js";
import banquetRoutes from "./routes/banquet.js";
import bookRoutes from "./routes/book.js";
import contactRoutes from "./routes/contact.js";
import menuRoutes from "./routes/menu.js";
import adminSchema from "./models/admin.js";

dotenv.config();

const app = express();
app.use(cookieParser("signed-cookie"));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../frontend/src/Components/banquet-Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: ['Set-Cookie'], // Add this line
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'] // Add 'Cookie'
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

// Initializing all routes as middleware
app.use("/", authRoutes);
app.use("/", bookRoutes);
app.use("/", contactRoutes);
app.use("/", menuRoutes);
app.use("/", upload.single("image"), banquetRoutes);

AdminJS.registerAdapter(AdminJSMongoose);

const port = process.env.PORT || 8000;
let setTrue = false;

const start = async () => {
  try {
    mongoose.set("strictQuery", false);
    const mongooseDb = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
    });

    await connectDB(process.env.MONGO_URL);

    const adminJS = new AdminJS({
      databases: [mongooseDb],
      rootPath: "/admin",
    });

    const router = AdminJSExpress.buildRouter(adminJS);

    const isLoggedIn = async (req, res, next) => {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new Error("Please provide email and password"));
      }
      const adminData = await adminSchema.findOne({ email });
      if (adminData && adminData.password === password) {
        req.isAdmin = true;
        return next();
      }
      return next(new Error("Invalid email or password"));
    };

    const redirectToAdmin = (req, res, next) => {
      if (req.isAdmin) {
        setTrue = true;
        return res.redirect("/admin");
      }
      next(new Error("Invalid email or password"));
    };

    app.use("/login", isLoggedIn, redirectToAdmin);

    app.use(
      adminJS.options.rootPath,
      (req, res, next) => {
        console.log(setTrue);
        if (setTrue) {
          return next();
        }
        next(new Error("Please provide email or password"));
      },
      router
    );

    app.listen(port, '0.0.0.0', () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
