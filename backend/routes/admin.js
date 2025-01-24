const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");

const mongoose = require("mongoose");

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: "/admin",
});

const router = AdminBroExpress.buildRouter(adminBro);

module.exports = router;
