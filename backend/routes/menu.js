import express from "express";
import { getMenu, createMenu } from "../controllers/menu.js";

const router = express.Router();

router.route("/api/menu").get(getMenu);
router.route("/api/menu/:banquetId/:token").get(getMenu);
router.route("/api/menu/:token").post(createMenu);

export default router;