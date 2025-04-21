import express from "express";
import { getMenu, createMenu } from "../controllers/menu.js";

const router = express.Router();

// Route for getting all menus (if needed)
router.route("/api/menu").get(getMenu);

// Route for getting a specific menu by banquet ID and token
router.route("/api/menu/:banquetId/:token").get(getMenu);

// Route for creating a new menu
router.route("/api/menu/:token").post(createMenu);

export default router;