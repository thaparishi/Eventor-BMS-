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
import fs from "fs";
import { fileURLToPath } from "url";

// Import routes and models
import authRouter from "./routes/auth.js";
import banquetRouter from "./routes/banquet.js";
import bookRouter from "./routes/book.js";
import contactRouter from "./routes/contact.js";
import menuRouter from "./routes/menu.js";
import AdminModel from "./models/admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../frontend/src/Components/banquet-Images");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });


// Initial middleware
app.use(cookieParser("signed-cookie"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.static("./public"));
app.use(expressSession({
  secret: process.env.SESSION_SECRET || 'default-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));
app.use("/banquet-Images", express.static(path.join(__dirname, "../frontend/src/Components/banquet-Images")));



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

  const router = AdminJSExpress.buildRouter(adminJs);

  return { adminJs, router };
};

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.redirect('/admin');
  }
};

// Server startup
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    
    // 1. Setup AdminJS first
    const { adminJs, router } = setupAdminJS();
    app.use('/admin', isAuthenticated, router);

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

    // Serve custom login page
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    // Handle login form submission
    app.post('/login', async (req, res) => {
      const { email, password } = req.body;

      console.log("Login request received:", { email, password });

      if (!email || !password) {
        return res.status(400).send('Email and password are required');
      }

      const admin = await AdminModel.findOne({ email });

      console.log("Admin found in database:", admin);

      if (admin && admin.password === password) {
        req.session.admin = admin;
            return res.redirect('/admin');
      } else {
        return res.status(401).send('Invalid credentials');
      }
    });

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