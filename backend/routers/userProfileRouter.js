import express from "express";
import authentication from "../middlewares/authentication.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userProfileController.js";
const userProfileRouter = express.Router();

userProfileRouter.get("/view", authentication, getUserProfile);
userProfileRouter.patch("/update", authentication, updateUserProfile);


export default userProfileRouter;
