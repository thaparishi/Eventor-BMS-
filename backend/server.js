//Importing express from package.json.
const express = require("express");
//Initializing the express functions to app variable.
const app = express();

const cors = require("cors");

const path = require("path");

const multer = require("multer");

const cokkieParser = require("cookie-parser");

app.use(cokkieParser("signed-cookie"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../frontend/src/Components/banquet-Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

//Importing auth.js file from routes folder.
const auth = require("./routes/auth");

//Importing banquet.js file from routes folder.
const banquet = require("./routes/banquet");

//Importing book.js file from routes folder.
const book = require("./routes/book");

const contact = require("./routes/contact");


//Acceping the incomming request object as a json object.
app.use(express.json());

app.use(cors());

//Acceping the incomming request object as  String or arrays.
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./public"));

//Initializing all the routes from auth as a middleware in the server.
app.use("/", auth);

//Initializing all the routes from book.js as a midddleware in the server.
app.use("/", book);

app.use("/", contact);


//Initializing all the routes from banquet.js as a midddleware in the server.
app.use("/", upload.single("image"), banquet);

//Importing connectDB function from db folder.
const connectDB = require("./db/connect");

//Importing dotenv and configuring the dotenv in the project.
require("dotenv").config();

const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");
const mongoose = require("mongoose");

const authentication = require("express-authentication");
const adminSchema = require("./models/admin");

AdminBro.registerAdapter(AdminBroMongoose);

//Initializing the port value.
const port = 8000 || process.env.PORT;

let setTrue = false;

//Connecting to database and starting the server.
const start = async () => {
  try {
    //Connecting to the server.
    mongoose.set("strictQuery", false);

    const mongooseDb = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
    });

    await connectDB(process.env.MONGO_URL);

    const adminBro = new AdminBro({
      databases: [mongooseDb],
      rootPath: "/admin",
    });

    const router = AdminBroExpress.buildRouter(adminBro);

    const isLoggedIn = async (req, res, next) => {
      const { email, password } = req.body;
      if (!email && !password) {
        const err = new Error("Please Provide passwor d and email");
        err.status = 401;
        next(err);
      }
      const adminData = await adminSchema.findOne({ email: email });
      if (adminData) {
        if (adminData.password === password) {
          req.isAdmin = true;
          return next();
        }
      }
      const err = new Error("Invaild email or password");
      err.status = 401;
      next(err);
    };

    const redirectToAdmin = (req, res, next) => {
      if (req.isAdmin) {
        setTrue = true;
        // next();
        return res.redirect("/admin");
      }
      const err = new Error("Invaild email or password");
      err.status = 401;
      next(err);
    };

    app.use("/login", isLoggedIn, redirectToAdmin);

    app.use(
      adminBro.options.rootPath,
      (req, res, next) => {
        console.log(setTrue);
        if (setTrue) {
          // setTrue = false;
          return next();
        }
        const err = new Error("Please Provide email or password");
        err.status = 401;
        next(err);
      },
      router
    );

    //Starting the server on port 8000.
    app.listen(port, () => {
      console.log(`Listening to ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

//Calling the start function and starting the server.
start();
