import mongoose from "mongoose";
import User from "./UserModel.js";

const JobSeekerSchema = new mongoose.Schema({
  profile: {
    skills: {
      type: [String],
    },
    resume: {
      type: String,
    },
    resumeDisplayName: {
      type: String,
    },
    about: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
    location: {
      type: String,
    },
    noticePeriod: {
      value: {
        type: Number,
        // required: true,
      },
      unit: {
        type: String,
        // required: true,
        enum: ["days", "months"],
      },
    },
    status: {
      type: String,
      enum: ["Active", "Looking", "Not Looking"],
      default: "Active",
    },
  },
  savedJobs: { type: [mongoose.Schema.Types.ObjectId] },
  experience: [
    {
      company: { type: String, required: true },
      role: { type: String, required: true },
      duration: { type: String },
      jobType: {
        type: String,
        enum: ["Full-time", "Internship"],
      },
      currentCompany: { type: Boolean },
      salary: { type: Number },
      description: { type: String },
    },
  ],
  education: [
    {
      institute: {
        type: String,
        required: true,
      },
      course: {
        type: String,
        required: true,
      },
      specialization: {
        type: String,
      },
      startYear: {
        type: Number,
      },

      endYear: {
        type: Number,
      },

      grade: {
        type: Number,
        min: 1,
        max: 10,
      },
    },
  ],
  jobPreferences: {
    locations: { type: [String] },
    roles: { type: [String] },
    expectedSalary: { from: Number, to: Number },
    jobType: { type: String, enum: ["Full-time", "Internship"] },
  },

  languages: [
    {
      language: {
        type: String,
      },
      proficiency: {
        type: String,
        enum: ["Beginner", "Proficient", "Expert"],
      },
      read: { type: Boolean },
      write: { type: Boolean },
      speak: { type: Boolean },
    },
  ],
  //profileCompletion initially 10% for mandatory firstName,lastName,email,password
});

const JobSeeker = User.discriminator("JobSeeker", JobSeekerSchema);
export default JobSeeker;
