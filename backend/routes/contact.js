import express from "express";
import { createContact } from "../controllers/contact.js";

const router = express.Router();

router.route("/api/contact").post(createContact);

export default router;