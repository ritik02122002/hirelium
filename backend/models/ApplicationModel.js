import mongoose from "mongoose";
import JobSeeker from "./JobSeekerModel.js";
import Job from "./JobModel.js";
import { VALID_APPLICATION_STATUS } from "../utils/constant.js";
import validator from "validator";

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
    resumeURL: {
      type: String,
      required: true,
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error("invalid resume URL");
        }
      },
    },
    coverLetter: {
      type: String,
      minLength: 300,
      maxLength: 5000,
    },
    //coverLetter: required if recruiter has choosen to make it mandatory for that job
    // customResume: if candidate wants to apply with a diff resume then that on profile
  },
  { timestamps: true }
);

const Application = new mongoose.model("Application", ApplicationSchema);
export default Application;
