import express from "express";
import { forgetPassword, getMyProfile, login, logout, resetPassword, signup } from "../controllers/userController.js";
import { isAuthenticate } from "../middlewares/Auth.js";

const router = express.Router();

// To signup a new user
router.route("/signup").post(signup);
// To login a existing user
router.route("/login").post(login);
//Logout
router.route("/logout").get(logout);
// forget password
router.route("/forgetpassword").post(forgetPassword);
// reset password
router.route("/resetpassword/:token").put(resetPassword);

router.route("/me").get(isAuthenticate , getMyProfile)




export default router;