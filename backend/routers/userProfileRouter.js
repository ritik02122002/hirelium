import express from "express";
import authentication from "../middlewares/authentication.js";
import {
  getUserProfile,
  updateProfilePhoto,
  updateUserArrayElementDetails,
  updateUserProfile,
} from "../controllers/userProfileController.js";
const userProfileRouter = express.Router();

userProfileRouter.get("/view", authentication, getUserProfile);
userProfileRouter.patch("/update", authentication, updateUserProfile);
userProfileRouter.patch(
  "/update/arrayElement",
  authentication,
  updateUserArrayElementDetails
);
userProfileRouter.post(
  "/update/profilePhoto",
  authentication,
  updateProfilePhoto
);

export default userProfileRouter;
