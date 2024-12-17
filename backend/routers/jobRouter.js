import express from "express";
import {
  applyorWithdrawJob,
  deleteAJob,
  getAllActiveJobs,
  getApplicantsForThisJob,
  getAppliedJobDetails,
  getPostedJobDetails,
  postJob,
  updateJobDetails,
} from "../controllers/jobController.js";
import authentication from "../middlewares/authentication.js";
import authorizeJobSeeker from "../middlewares/authorizeJobSeeker.js";
import authorizeRecruiter from "../middlewares/authorizeRecruiter.js";
const jobRouter = express.Router();

jobRouter.get("/active/all", getAllActiveJobs);
jobRouter.post(
  "/toggle/ApplyWithdraw",
  authentication,
  authorizeJobSeeker,
  applyorWithdrawJob
);
jobRouter.get(
  "/applied",
  authentication,
  authorizeJobSeeker,
  getAppliedJobDetails
);

jobRouter.get(
  "/posted",
  authentication,
  authorizeRecruiter,
  getPostedJobDetails
);

jobRouter.get(
  "/applicants",
  authentication,
  authorizeRecruiter,
  getApplicantsForThisJob
);

jobRouter.post("/post", authentication, authorizeRecruiter, postJob);
jobRouter.patch(
  "/update",
  authentication,
  authorizeRecruiter,
  updateJobDetails
);
jobRouter.delete("/delete", authentication, authorizeRecruiter, deleteAJob);

export default jobRouter;
