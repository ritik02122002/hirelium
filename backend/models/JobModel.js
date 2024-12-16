import mongoose from "mongoose";
const JobSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      minLength: 10,
      maxLenth: 50,
      required: true,
    },
    description: {
      type: String,
      minLength: 100,
      maxLenth: 1000,
    },
    qualifications: { type: [String], required: true },
    responsibilities: { type: [String], required: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    salaryDetails: {
      minimumSalary: {
        type: Number,
      },
      maximumSalary: {
        type: Number,
      },
      currency: {
        type: String,
        enum: ["INR", "$"],
      },
      unit: {
        type: String,
        enum: ["pa", "pm"],
      },
    },

    additionalInfo: { type: [String] },
    workModel: {
      type: String,
      enum: ["On-Site", "Hybrid", "Remote"],
    },
    minimumExperience: {
      type: Number,
    },
    maximumExperience: {
      type: Number,
    },

    jobType: { type: String, enum: ["Full-time", "Internship"] },
    locations: { type: [String] },
    vacancy: {
      type: Number,
    },
    appliedCount: {
      type: Number,
      default: 0,
    },
    keySkills: {
      type: [String],
    },
    isJobActive: {
      type: Boolean,
      default: true,
    },
    // "hideApplyButton": false, true for hr, admin and guests
    //showRecruiterDetail: false,  for premium
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);
export default Job;
