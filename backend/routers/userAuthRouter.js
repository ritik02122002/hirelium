import express from "express";
import {
  login,
  logout,
  register,
  sendOtpForPasswordReset,
  updatePassword,
} from "../controllers/userAuthController.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/otp", sendOtpForPasswordReset);
authRouter.patch("/password/update", updatePassword);

export default authRouter;
