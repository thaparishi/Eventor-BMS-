import express from "express";
const app = express();
import cors from "cors";
import path from "path";
import multer from "multer";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import mongoose from "mongoose";
import { AdminJS } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

// Import routes and models
import authRouter from "./routes/auth.js";
import banquetRouter from "./routes/banquet.js";
import bookRouter from "./routes/book.js";
import contactRouter from "./routes/contact.js";
import menuRouter from "./routes/menu.js";
import AdminModel from "./models/admin.js";
import BanquetOwnerModel from "./models/banquetowner.js";
import BanquetModel from "./models/banquet.js";
import MenuModel from "./models/menu.js";
import BookModel from "./models/book.js";
import BlogModel from "./models/blog.js";
import blogRouter from "./routes/blog.js";
import contactModel from "./models/contact.js";
import registerModel from "./models/register.js";

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
app.use("/banquet-Images", express.static(path.join(__dirname, "../frontend/src/Components/banquet-Images/")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/Images", express.static(path.join(__dirname, "Images")));


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
    },
    assets: {
      styles: ['admin.css'],
    },
    resources: [
      // Admin resource - visible only to admins
      {
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
          actions: {
            // Only admins can see or edit admins
            list: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            show: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            edit: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            delete: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            new: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
          }
        }
      },

      {
        resource: contactModel,
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
          actions: {
            // Only admins can see or edit admins
            list: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            show: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            edit: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            delete: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            new: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
          }
        }
      },

      {
        resource: registerModel,
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
          actions: {
            // Only admins can see or edit admins
            list: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            show: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            edit: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            delete: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            new: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
          }
        }
      },
      
      // BanquetOwner resource - visible only to admins
      {
        resource: BanquetOwnerModel,
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
          actions: {
            // Only admins can see or edit banquet owners
            list: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            show: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            edit: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            delete: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            new: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
          }
        }
      },
      // Banquet resource with role-based access control
      {
        resource: BanquetModel,
        options: {
          properties: {
            // Define property visibility and options here
          },
          actions: {
            // Admins can do everything
            list: { isAccessible: ({ currentAdmin }) => currentAdmin },
            // For banquet owners, filter only their banquets
            show: { 
              isAccessible: ({ currentAdmin }) => currentAdmin,
              before: async (request, context) => {
                // If it's a banquet owner, filter to show only their banquets
                if (currentAdmin.role === 'banquetOwner') {
                  request.query = { 
                    ...request.query,
                    'filters.userId': currentAdmin.userId 
                  };
                }
                return request;
              }
            },
            edit: {
              isAccessible: ({ currentAdmin, record }) => {
                // Admins can edit any banquet
                if (currentAdmin.role === 'admin') return true;
                // Banquet owners can only edit their own banquets
                return currentAdmin.userId === record.params.userId;
              }
            },
            // Only admins can delete banquets
            delete: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            // Only admins can create new banquets directly through AdminJS
            new: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
          }
        }
      },
      // Menu resource with role-based access control
      {
        resource: MenuModel,
        options: {
          actions: {
            list: { isAccessible: ({ currentAdmin }) => currentAdmin },
            show: { 
              isAccessible: ({ currentAdmin }) => currentAdmin,
              before: async (request, context) => {
                // If it's a banquet owner, filter to show only their menus
                if (currentAdmin.role === 'banquetOwner') {
                  request.query = { 
                    ...request.query,
                    'filters.userId': currentAdmin.userId 
                  };
                }
                return request;
              }
            },
            edit: {
              isAccessible: ({ currentAdmin, record }) => {
                // Admins can edit any menu
                if (currentAdmin.role === 'admin') return true;
                // Banquet owners can only edit their own menus
                return currentAdmin.userId === record.params.userId;
              }
            },
            // Only admins can delete menus
            delete: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            // Only admins can create new menus directly through AdminJS
            new: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
          }
        }
      },
      // Book resource with role-based access control
      {
        resource: BookModel,
        options: {
          actions: {
            list: { isAccessible: ({ currentAdmin }) => currentAdmin },
            show: { 
              isAccessible: ({ currentAdmin }) => currentAdmin,
              before: async (request, context) => {
                if (currentAdmin.role === 'banquetOwner') {
                  // Find the banquets owned by this owner
                  const ownedBanquets = await BanquetModel.find({ userId: currentAdmin.userId });
                  const banquetIds = ownedBanquets.map(b => b._id.toString());
                  
                  // Filter bookings to only show those for the owner's banquets
                  request.query = { 
                    ...request.query,
                    'filters.banquetId': { $in: banquetIds } 
                  };
                }
                return request;
              }
            },
            // Only admins can edit bookings
            edit: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            // Only admins can delete bookings
            delete: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            // Only admins can create new bookings directly through AdminJS
            new: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
          }
        }
      },
      // Blog resource with role-based access control
      {
        resource: BlogModel,
        options: {
          properties: {
            createdAt: {
              isVisible: { list: true, filter: true, show: true, edit: false }
            },
            postedDate: {
              isVisible: { list: true, filter: false, show: true, edit: false }
            },
            _id: { 
              isVisible: { list: false, filter: false, show: true, edit: false }
            },
            text: {
              type: 'textarea',
              isVisible: { list: false, filter: false, show: true, edit: true }
            },
            image: {
              isVisible: { list: true, filter: false, show: true, edit: true },
            }
          },
          actions: {
            // Only admins can manage blogs
            list: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            show: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            edit: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            delete: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
            new: { 
              isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
              before: async (request) => {
                if (request.payload.image) {
                  const imagePath = `Components/Images/gallery/${path.basename(request.payload.image)}`;
                  request.payload.image = imagePath;
                }
                return request;
              }
            }
          }
        }
      }
    ]
  });

  // Authenticate using both Admin and BanquetOwner models
  const router = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate: async (email, password) => {
        // Try to find in Admin model first
        const admin = await AdminModel.findOne({ email });
        if (admin) {
          const matched = await bcrypt.compare(password, admin.password);
          if (matched) {
            return {
              ...admin._doc,
              role: 'admin'  // Explicitly set role for AdminJS
            };
          }
        }
        
        // If not found in Admin, check BanquetOwner model
        const banquetOwner = await BanquetOwnerModel.findOne({ email });
        if (banquetOwner) {
          const matched = await bcrypt.compare(password, banquetOwner.password);
          if (matched) {
            return {
              ...banquetOwner._doc,
              role: 'banquetOwner'  // Explicitly set role for AdminJS
            };
          }
        }
        
        return false;
      },
      cookiePassword: process.env.COOKIE_SECRET || 'some-secret-password-used-to-secure-cookie',
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
    app.use("/", blogRouter);
    app.use("/", upload.single("image"), banquetRouter);
    app.use("/images", express.static("image"));

    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();