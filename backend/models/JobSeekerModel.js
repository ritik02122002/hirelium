import mongoose from "mongoose";
import User from "./UserModel.js";
import {
  JOBSEEKER_SKILL_MAX_LENGTH,
  JOBSEEKER_MAX_SKILLS,
  JOBSEEKER_ABOUT_MIN_LENGTH,
  JOBSEEKER_ABOUT_MAX_LENGTH,
} from "../utils/constant.js";
import validator from "validator";

const JobSeekerSchema = new mongoose.Schema({
  skills: {
    type: [String],
    validate: (value) => {
      if (value.length > JOBSEEKER_MAX_SKILLS)
        throw new Error(
          "you can add at most" + JOBSEEKER_MAX_SKILLS + "skills"
        );
      value.forEach((skill) => {
        if (skill.length > JOBSEEKER_SKILL_MAX_LENGTH)
          throw new Error(
            "Each skills can have at most " +
              JOBSEEKER_SKILL_MAX_LENGTH +
              " length"
          );
          if (skill.length < 2)
            throw new Error(
              "Skill should contain atleast 2 characters"
            );
      });
    },
    set: (value) => value.map((val) => val.toLowerCase()),
  },
  resumeDetails: [
    {
      resumeURL: {
        type: String,
        maxLength: 200,
        required: true,
        validate: (value) => {
          if (!validator.isURL(value)) {
            throw new Error("invalid resume URL");
          }
        },
      },
      resumeDisplayName: {
        type: String,
        maxLength: 50,
        required: true,
      },
      resumeUploadDate: {
        type: Date,
        max: Date.now,
        default: Date.now,
      },
    },
  ],

  defaultResume: {
    type: String,
    validate: (value) => {
      if (!validator.isURL(value)) {
        throw new Error("invalid resume URL");
      }
    },
  },

  about: {
    type: String,
    minLength: JOBSEEKER_ABOUT_MIN_LENGTH,
    maxLength: JOBSEEKER_ABOUT_MAX_LENGTH,
  },
  currentLocation: {
    type: String,
    minLength: 3,
    maxLength: 40,
    lowercase: true,
  },
  noticePeriod: {
    type: String,
    enum: [
      "Immediate",
      "15 Days or Less",
      "1 month",
      "2 months",
      "3 months or More",
    ],
    default: "Immediate",
  },
  jobSearchStatus: {
    type: String,
    enum: {
      values: ["Active", "Looking", "Not Looking"],
      message: "{VALUE} is not supported",
    },
    default: "Active",
  },
  // savedJobs: { type: [mongoose.Schema.Types.ObjectId] },
  experience: [
    {
      company: {
        type: String,
        required: true,
        minLength: [2, "Length should be atleast 2"],
        maxLength: 50,
      },
      designation: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
      },
      startYear: {
        type: Number,
        min: 1900,
        required: function () {
          return this.endYear;
        },
      },

      endYear: {
        type: Number,
        max: 2050,
        required: function () {
          return this.startYear;
        },
        validate: function (value) {
          if (this.startYear > value)
            throw new Error("start year cannot be greater than end year");
        },
      },

      jobType: {
        type: String,
        enum: ["Full-time", "Internship"],
        required: true,
      },
      // isCurrentCompany: { type: Boolean, default: false },
      salaryDetails: {
        salary: {
          type: Number,
          min: 1,
        },
        currency: {
          type: String,
          default: "INR",
          enum: ["INR", "$"],
        },
        // unit: {  //per month for internship and per annum for full time
        //   type: String,
        //   default: "pa",
        //   enum: ["pa", "pm"],
        // },
      },
      description: { type: String, minLength: 20, maxLength: 1000 },
    },
  ],
  education: [
    {
      institute: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100,
      },
      course: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 40,
      },
      specialization: {
        type: String,
        minLength: 3,
        maxLength: 100,
      },
      startYear: {
        type: Number,
        min: 1900,
        required: function () {
          return this.endYear;
        },
      },

      endYear: {
        type: Number,
        max: 2050,
        required: function () {
          return this.startYear;
        },
        validate: function (value) {
          if (this.startYear > value)
            throw new Error("start year cannot be greater than end year");
        },
      },

      grade: {
        type: Number,
        min: [1, "grade must be between 1 and 10"],
        max: [10, "grade must be between 1 and 10"],
      },
      // isCurrentEducation: { type: Boolean, default: false },
    },
  ],
  jobPreferences: {
    preferredLocations: {
      type: [String],
      validate: (value) => {
        if (value.length > 5)
          throw new Error("you can add at most 5 preferred Locations");
        value.forEach((loc) => {
          if (loc.length > 30)
            throw new Error("Each location can have at most 30 length");
        });
      },
      set: (value) => value.map((val) => val.toLowerCase()),
    },
    preferredRoles: {
      type: [String],
      validate: (value) => {
        if (value.length > 5)
          throw new Error("you can add at most 5 preferred Roles");
        value.forEach((role) => {
          if (role.length > 30)
            throw new Error("Each role can have at most 30 length");
        });
      },
      set: (value) => value.map((val) => val.toLowerCase()),
    },
    expectedSalary: {
      minimumSalary: {
        type: Number,
        min: 0,
        max: 100000000,
      },
      maximumSalary: {
        type: Number,
        min: 0,
        max: 100000000,
        validate: function (value) {
          if (this.minimumSalary && this.minimumSalary > value)
            throw new Error(
              "maximum salary must be greater than or equal to minimum salary"
            );
        },
      },
      currency: {
        type: String,
        default: "INR",
        enum: ["INR", "$"],
      },
    },
    preferredjobType: { type: String, enum: ["Full-time", "Internship"] },
  },

  languages: [
    {
      language: {
        type: String,
        required: true,
      },
      proficiency: {
        type: String,
        enum: ["Beginner", "Proficient", "Expert"],
      },
      read: { type: Boolean, default: true },
      write: { type: Boolean, default: true },
      speak: { type: Boolean, default: true },
    },
  ],

  profileScore: {
    type: Number,
    min: 5,
    max: 100,
    default: 5,
  },
  //profileCompletion initially 10% for mandatory firstName,lastName,email,password
  // "videoProfile"
  // canRecruiterSeeMyProfile
});

const JobSeeker = User.discriminator("JobSeeker", JobSeekerSchema);
export default JobSeeker;
