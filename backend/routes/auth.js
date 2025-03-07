import express from "express";
import {
  register,
  verify,
  login,
  sendResetPasswordLink,
  verifyEmail,
  changePassword,
  checkLoginCookie,
  deleteLoginCookie,
} from "../controllers/auth.js";

const router = express.Router();

// Creating HTTP request methods with express router
router.route("/api/register").post(register);
router.route("/api/verify/:id").get(verify);
router.route("/api/login").post(login);
router.route("/api/checkLoginCookie").get(checkLoginCookie);
router.route("/api/deleteLoginCookies").get(deleteLoginCookie);
router.route("/api/sendResetPasswordLink").post(sendResetPasswordLink);
router.route("/api/verifyEmail/:id").get(verifyEmail);
router.route("/api/changePassword").post(changePassword);

export default router;