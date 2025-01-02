import validator from "validator";
import Company from "../models/CompanyModel.js";
import { computeProfileScore, sendOtp } from "../utils/helper.js";
import OTP from "../models/OtpModel.js";
import Recruiter from "../models/RecruiterModel.js";
import JobSeeker from "../models/JobSeekerModel.js";
import {
  DEFAULT_PAGE,
  DEFAULT_RESULT_LIMIT,
  JOBSEEKER_RECRUITER_VIEW,
} from "../utils/constant.js";

export const sendOtpForCompanyEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const { user } = req;

    //email is mandatory for verification
    if (!email) throw new Error("email id is not present");
    if (!validator.isEmail(email)) {
      throw new Error("invalid email");
    }

    //finding the company domain from company email
    const companyDomain = email.substring(email.indexOf("@") + 1, email.length);

    //checking if company is registered or not. it must be registered
    const company = await Company.findOne({ companyDomain });
    if (!company) throw new Error("invalid email");

    //if all checks pass sending the otp
    await sendOtp(user.firstName, email, "companyEmailVerification");

    res.json({
      message: `OTP sent successfully to ${user.firstName}`,
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const verifyCompanyEmail = async (req, res) => {
  try {
    let { email, otp, designation } = req.body;
    const { user } = req;

    //email and otp are mandatory
    if (!email || !otp) throw new Error("email id or otp is not present");

    if (!validator.isEmail(email)) {
      throw new Error("invalid email");
    }

    const purpose = "companyEmailVerification";

    otp = parseInt(otp);

    // finding details from otp collection
    const otpInstance = await OTP.findOne({ email, otp, purpose });

    if (!otpInstance) throw new Error("invalid email or otp or purpose");

    const companyDomain = email.substring(email.indexOf("@") + 1, email.length);

    //checking if company is registered or not
    const company = await Company.findOne({ companyDomain });
    if (!company) throw new Error("invalid company");

    //list of all companies in which the current user/recruiter has permissions to post
    const companiesList = user.companyDetails;

    //checking if the company already exist in that list
    const isCompanyEmailAlreadyVerified = companiesList.some((comp) =>
      comp.companyId.equals(company._id)
    );

    //if company already exists in recruiter's list
    if (isCompanyEmailAlreadyVerified)
      throw new Error("Company email already verified");

    //if not then adding it to the list
    const updatedRecruiterDetails = await Recruiter.findByIdAndUpdate(
      user._id,
      {
        companyDetails: [
          ...companiesList,
          { companyId: company._id, designation },
        ],
      },
      { runValidators: true, returnDocument: "after" }
    );

    //if some validatations fail while updating
    if (!updatedRecruiterDetails) throw new Error("invalid details");

    res.json({
      message: `Recruiter email verified successfully for ${company.name}`,
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const bookmarkAJobSeeker = async (req, res) => {
  try {
    const { jobSeekerId } = req.body;
    const { user } = req;

    //jobSeekerId is mandatory
    if (!jobSeekerId) throw new Error("job seeker id is missing");

    //finding if jobSeeker exists for jobSeekerId (jobSeekerId is valid or not)
    const jobSeeker = await JobSeeker.findById(jobSeekerId);

    //if not invalid request
    if (!jobSeeker) throw new Error("invalid job seeker");

    //getting the bookmarked list of the recruiter
    const bookmarkedJobSeekersId = user.bookmarkedJobSeekersId;

    //checking if this jobSeeker is already in list
    const isJobSeekerAlreadyBookmarked = bookmarkedJobSeekersId.some(
      (jobseekerId) => jobseekerId.equals(jobSeekerId)
    );
    //if yes we do not add jobseeker
    if (isJobSeekerAlreadyBookmarked)
      throw new Error("Job seeker is already bookmarked");

    //otherwise we add the jobseeker to the bookmarked list
    const updatedRecruiterDetails = await Recruiter.findByIdAndUpdate(
      user._id,
      {
        bookmarkedJobSeekersId: [...bookmarkedJobSeekersId, jobSeekerId],
      },
      { runValidators: true, returnDocument: "after" }
    );

    //if some validatations fail while updating
    if (!updatedRecruiterDetails) throw new Error("invalid details");

    res.json({
      message: `Job seeker : ${jobSeeker.firstName} bookmarked by ${user.firstName}`,
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const getAllBookmarkedJobSeekers = async (req, res) => {
  try {
    const { user } = req;
    let { page, limit } = req.query;

    limit = parseInt(limit) || DEFAULT_RESULT_LIMIT;
    page = parseInt(page) || DEFAULT_PAGE;

    const skip = limit * (page - 1);

    //getting the bookmarked list of the recruiter
    const bookmarkedJobSeekersId = user.bookmarkedJobSeekersId;

    //find the jobSeekers details
    const bookmarkedJobSeekers = await JobSeeker.find(
      {
        _id: { $in: bookmarkedJobSeekersId },
      },
      JOBSEEKER_RECRUITER_VIEW
    )
      .skip(skip)
      .limit(limit)
      .select("-password");

    if (bookmarkedJobSeekers.length == 0) {
      res.json({
        message: `No results found`,
        status: "success",
      });
    } else {
      res.json({
        message: `Fetched job seekers bookmarked by ${user.firstName} on page ${page}`,
        status: "success",
        data: bookmarkedJobSeekers,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const viewJobSeekerProfile = async (req, res) => {
  try {
    const { jobSeekerId } = req.body;
    const { user } = req;
    if (!jobSeekerId) throw new Error("job seeker id is missing");
    const jobSeeker = await JobSeeker.findById(
      jobSeekerId,
      JOBSEEKER_RECRUITER_VIEW
    );
    if (!jobSeeker) throw new Error("job seeker does not exist");
    res.json({
      message: `job seeker profile fetched successfully by ${user.firstName}`,
      status: "success",
      data: jobSeeker,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const getAllJobSeekers = async (req, res) => {
  try {
    const { user } = req;
    let { page, limit } = req.query;

    limit = parseInt(limit) || DEFAULT_RESULT_LIMIT;
    page = parseInt(page) || DEFAULT_PAGE;

    const skip = limit * (page - 1);

    const jobSeekers = await JobSeeker.find({}, JOBSEEKER_RECRUITER_VIEW)
      .sort({
        profileScore: -1,
        _id: 1,
      })
      .skip(skip)
      .limit(limit);
    if (jobSeekers.length) {
      res.json({
        message: `Job seekers profile on page ${page} fetched successfully by ${user.firstName}`,
        status: "success",
        data: jobSeekers,
      });
    } else {
      res.json({
        message: `No Job seekers found on page ${page}`,
        status: "success",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};
