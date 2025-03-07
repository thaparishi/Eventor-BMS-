import express from "express";
const app = express();
import cors from "cors";
import path from "path";
import multer from "multer";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import mongoose from "mongoose";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import dotenv from "dotenv";

// Import routes and models
import authRouter from "./routes/auth.js";
import banquetRouter from "./routes/banquet.js";
import bookRouter from "./routes/book.js";
import contactRouter from "./routes/contact.js";
import menuRouter from "./routes/menu.js";
import AdminModel from "./models/admin.js";

dotenv.config();

// Initial middleware
app.use(cors({
  origin: "http://localhost:3000", // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
}));
app.use(cookieParser("signed-cookie"));
app.use(cors());
app.use(express.static("./public"));
app.use(expressSession({
  secret: process.env.SESSION_SECRET || 'default-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("../frontend/src/Components/banquet-Images"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Database connection
const connectDB = async (mongoUrl) => {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// AdminJS setup
AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const setupAdminJS = () => {
  const adminJs = new AdminJS({
    databases: [mongoose],
    rootPath: "/admin",
    branding: {
      companyName: "Eventor - BMS",
      logo: "/images/logo.png",
      favicon: "/favicon.ico",
    },
    resources: [{
      resource: AdminModel,
      options: {
        properties: {
          password: {
            type: 'password',
            isVisible: {
              list: false,
              edit: true,
              filter: false,
              show: false,
            },
          },
        },
      }
    }],
  });

  // Authentication logic
  const authenticate = async (email, password) => {
    const admin = await AdminModel.findOne({ email });
    if (admin && admin.password === password) {
      return admin;
    }
    return null;
  };

  const router = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: process.env.SESSION_SECRET || 'default-secret',
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
    }
  );

  return { adminJs, router };
};

// Server startup
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    
    // 1. Setup AdminJS first
    const { adminJs, router } = setupAdminJS();
    app.use(adminJs.options.rootPath, router);

    // 2. Add body-parser middleware after AdminJS
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // 3. Add routes that need body-parser
    app.use("/", authRouter);
    app.use("/", bookRouter);
    app.use("/", contactRouter);
    app.use("/", menuRouter);
    app.use("/", upload.single("image"), banquetRouter);
    app.use("/images", express.static("image"));

    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`AdminJS dashboard at http://localhost:${port}/admin`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();