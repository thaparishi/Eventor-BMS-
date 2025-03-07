import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSMongoose from "@adminjs/mongoose"; // Import the Mongoose adapter
import mongoose from "mongoose";

// Register the Mongoose adapter
AdminJS.registerAdapter(AdminJSMongoose);

// Initialize AdminJS
const adminJs = new AdminJS({
  databases: [mongoose], // Pass Mongoose as a database
  rootPath: "/admin", // Define the root path for the AdminJS dashboard
});

// Build the AdminJS router
const router = AdminJSExpress.buildRouter(adminJs);

// Export the router
export default router;