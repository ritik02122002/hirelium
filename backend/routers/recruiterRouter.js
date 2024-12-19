import express from "express";
import authentication from "../middlewares/authentication.js";
import authorizeRecruiter from "../middlewares/authorizeRecruiter.js";
import {
  bookmarkAJobSeeker,
  getAllBookmarkedJobSeekers,
  sendOtpForCompanyEmailVerification,
  verifyCompanyEmail,
  viewJobSeekerProfile,
} from "../controllers/recruiterController.js";

const recruiterRouter = express.Router();

recruiterRouter.post(
  "/otp",
  authentication,
  authorizeRecruiter,
  sendOtpForCompanyEmailVerification
);
recruiterRouter.post(
  "/company",
  authentication,
  authorizeRecruiter,
  verifyCompanyEmail
);

recruiterRouter.post(
  "/bookmark",
  authentication,
  authorizeRecruiter,
  bookmarkAJobSeeker
);

recruiterRouter.get(
  "/bookmark",
  authentication,
  authorizeRecruiter,
  getAllBookmarkedJobSeekers
);

recruiterRouter.get(
  "/jobSeeker/view",
  authentication,
  authorizeRecruiter,
  viewJobSeekerProfile
);

export default recruiterRouter;
