import mongoose from "mongoose";
import JobSeeker from "./JobSeekerModel.js";
import Job from "./JobModel.js";
import { VALID_APPLICATION_STATUS } from "../utils/constant.js";

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Job,
      required: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: JobSeeker,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: VALID_APPLICATION_STATUS,
    },
  },
  { timestamps: true }
);

const Application = new mongoose.model("Application", ApplicationSchema);
export default Application;
