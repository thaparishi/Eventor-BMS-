const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");

const mongoose = require("mongoose");

const adminjs = new AdminJS({
  databases: [mongoose],
  rootPath: "/admin",
});

const router = AdminJSExpress.buildRouter(adminjs);

export default router;