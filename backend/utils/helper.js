import OTP from "../models/OtpModel.js";
import { DEFAULT_WEIGHTAGE_ORDER_FOR_JOB_MATH } from "./constant.js";
import nodemailer from "nodemailer";
import otpVerificationEmailBody from "./otpVerificationEmailBody.js";

export const getRandomValue = (from, to) => {
  return from + Math.floor(Math.random() * (to - from + 1));
};

export const getJobPrefernceMatch = (job, preferences, userSkills) => {
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
  }

  if (locations && preferredLocations)
    matches.location = locations.filter((loc) =>
      preferredLocations.includes(loc)
    ).length;

  if (role && preferredRoles && preferredRoles.includes(role))
    matches.jobRole = 1;

  if (userSkills && keySkills)
    matches.skills = keySkills.filter((skill) =>
      userSkills.includes(skill)
    ).length;
  let finalMatchValue = 0;
  const categoryCount = WEIGHTAGE.length;
  WEIGHTAGE.forEach((category, index) => {
    const categoryMatchValue = matches[category];
    if (categoryMatchValue > 0) {
      finalMatchValue += (categoryCount - index) * categoryMatchValue;
    }
  });
  return finalMatchValue;
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
