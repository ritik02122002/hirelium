import OTP from "../models/OtpModel.js";
import {
  DEFAULT_WEIGHTAGE_ORDER_FOR_JOB_MATH,
  JOBSEEKER_PROFILE_DETAIL_SCORES,
} from "./constant.js";
import nodemailer from "nodemailer";
import otpVerificationEmailBody from "./otpVerificationEmailBody.js";
import e from "express";

export const getRandomValue = (from, to) => {
  return from + Math.floor(Math.random() * (to - from + 1));
};

export const getJobUserMatch = (job, preferences, userSkills) => {
  // console.log(job);
  // console.log(preferences);
  // console.log(userSkills);

  const { jobType, locations, role, salaryDetails, keySkills } = job;
  const {
    preferredjobType,
    preferredLocations,
    preferredRoles,
    expectedSalary,
  } = preferences || {};

  const jobCurrency = salaryDetails?.currency;
  const expectedCurrency = expectedSalary?.currency;
  const WEIGHTAGE = DEFAULT_WEIGHTAGE_ORDER_FOR_JOB_MATH;
  //match count
  let matches = {
    jobType: 0,
    jobRole: 0,
    salary: 0,
    skills: 0,
    location: 0,
  };

  if (jobType && preferredjobType && jobType == preferredjobType) {
    matches.jobType = 1;
  }

  if (jobCurrency && expectedCurrency && jobCurrency == expectedCurrency) {
    const minJobSalary = salaryDetails?.minimumSalary
      ? salaryDetails.minimumSalary
      : 0;
    const maxJobSalary = salaryDetails?.minimumSalary
      ? salaryDetails.maximumSalary
      : 100000000;

    const minExpectedSalary = expectedSalary?.minimumSalary
      ? expectedSalary.minimumSalary
      : 0;
    const maxExpectedSalary = expectedSalary?.maximumSalary
      ? expectedSalary.maximumSalary
      : 100000000;
    if (
      Math.max(minExpectedSalary, minJobSalary) <=
      Math.min(maxExpectedSalary, maxJobSalary)
    )
      matches.salary = 1;
  }

  if (locations && preferredLocations)
    matches.location =
      locations.filter((loc) => preferredLocations.includes(loc)).length /
      (1.0 * locations.length);

  if (role && preferredRoles && preferredRoles.includes(role))
    matches.jobRole = 1;

  if (userSkills && keySkills)
    matches.skills =
      keySkills.filter((skill) => userSkills.includes(skill)).length /
      (1.0 * keySkills.length);
  let finalMatchValue = 0;
  const categoryCount = WEIGHTAGE.length;

  WEIGHTAGE.forEach((category, index) => {
    const categoryMatchValue = matches[category];
    if (categoryMatchValue > 0) {
      finalMatchValue += (categoryCount - index) * categoryMatchValue;
    }
  });
  finalMatchValue *= 100;
  finalMatchValue /= (categoryCount * (categoryCount + 1)) / 2;

  return Math.round(finalMatchValue * 1000) / 1000.0;
};

export const sendEmail = async (toEmailId, emailSubject, emailHtmlBody) => {
  const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;
  const FROM_MAIL_ID = process.env.FROM_MAIL_ID;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
      user: FROM_MAIL_ID,
      pass: EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Hirelium Support" <${FROM_MAIL_ID}>`,
    to: toEmailId,
    subject: emailSubject,
    html: emailHtmlBody,
  });
};

export const sendOtp = async (firstName, toEmailId, purpose) => {
  const otp = getRandomValue(100000, 999999);
  let emailSubject;
  let emailHtmlBody;
  if (purpose == "passwordReset") {
    emailSubject = "Reset Your Password - Hirelium OTP Verification";
  } else if (purpose == "companyEmailVerification") {
    emailSubject = "Verify Company Email - Hirelium OTP Verification";
  }
  const FROM_MAIL_ID = process.env.FROM_MAIL_ID;
  emailHtmlBody = otpVerificationEmailBody(
    firstName,
    otp,
    FROM_MAIL_ID,
    purpose
  );
  await sendEmail(toEmailId, emailSubject, emailHtmlBody);

  let otpInstance = await OTP.findOne({ email: toEmailId, purpose });
  if (!otpInstance) {
    otpInstance = new OTP({ email: toEmailId, otp, purpose });
    await otpInstance.save();
  } else {
    otpInstance.otp = otp;
    otpInstance.createdAt = new Date();
    await otpInstance.save();
  }
};

export const computeProfileScore = (profile) => {
  const {
    resumeDetails,
    skills,
    about,
    experience,
    education,
    phone,
    profilePicture,
    linkedInUsername,
    gender,
    noticePeriod,
    jobSearchStatus,
    currentLocation,
    languages,
  } = profile;

  let score = 5;
  const weightage = JOBSEEKER_PROFILE_DETAIL_SCORES;

  //score for resume
  if (resumeDetails && resumeDetails.resumeURL) {
    if (
      resumeDetails.resumeUploadDate &&
      Math.floor(
        (new Date() - new Date(resumeDetails.resumeUploadDate)) /
          (1000 * 60 * 60 * 24 * 30.5)
      ) <= weightage.resumeDetails[0]
    )
      score += weightage.resumeDetails[2];
    else score += weightage.resumeDetails[1];
  }

  //score for skills
  if (skills && skills.length) {
    if (skills.length < weightage.skills[0]) score += weightage.skills[1];
    else score += weightage.skills[2];
  }

  //score for about
  if (about && about.length) {
    if (about.length < weightage.about[0]) score += weightage.about[1];
    else score += weightage.about[2];
  }

  //score for experience
  if (experience) {
    if (experience.length > 0) score += weightage.experience;
  }

  //score for education
  if (education && education.length) {
    if (education.length <= weightage.education[0])
      score += weightage.education[1];
    else score += weightage.education[2];
  }

  //score for phone number
  if (phone) score += weightage.phone;

  //score for profile picture
  if (profilePicture) score += weightage.profilePicture;

  //score for linkedin handle
  if (linkedInUsername) score += weightage.linkedInUsername;

  //score for gender
  if (gender) score += weightage.gender;

  //score for notice period
  if (noticePeriod) {
    if (noticePeriod == "3 months or More") score += weightage.noticePeriod[0];
    else if (noticePeriod == "2 months") score += weightage.noticePeriod[1];
    else if (noticePeriod == "1 month") score += weightage.noticePeriod[2];
    else if (noticePeriod == "15 Days or Less")
      score += weightage.noticePeriod[3];
    else if (noticePeriod == "Immediate") score += weightage.noticePeriod[4];
  }

  //score for job search status
  if (jobSearchStatus) {
    if (jobSearchStatus == "Not Looking") score += weightage.jobSearchStatus[0];
    else if (jobSearchStatus == "Looking")
      score += weightage.jobSearchStatus[1];
    else if (jobSearchStatus == "Active") score += weightage.jobSearchStatus[2];
  }

  //score for current location
  if (currentLocation) {
    score += weightage.currentLocation;
  }

  //score for languages
  if (languages && languages.length) {
    if (languages.length <= weightage.languages[0])
      score += weightage.languages[1];
    else score += weightage.languages[2];
  }

  return score;
};

export const getMinMaxFromRange = (range) => {
  const indx = range.indexOf("-");
  const start = parseInt(range.substring(0, indx));
  const end = parseInt(range.substring(indx + 1, range.length));
  return [start, end];
};
