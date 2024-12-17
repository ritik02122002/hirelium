import Application from "../models/ApplicationModel.js";
import Job from "../models/JobModel.js";
import {
  JOB_VALID_UPDATES,
  VALID_APPLICATION_STATUS,
  VALID_JOB_DETAILS,
} from "../utils/constant.js";

export const getAllActiveJobs = async (req, res) => {
  try {
    //finding all active jobs
    const jobs = await Job.find({ isJobActive: true });

    //no active job found
    if (jobs.length == 0)
      res.json({
        message: `No active job exists`,
        status: "success",
      });
    else
      res.json({
        message: `Jobs fetched successfully`,
        status: "success",
        data: jobs,
        hideApplyButton: true,
      });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const applyorWithdrawJob = async (req, res) => {
  try {
    //job Id for which candidate is applying or withdrawing his application
    const { jobId } = req.body;
    const { _id } = req.user;
    if (!jobId) throw new Error("please provide jobId");

    //finding that job
    let job = await Job.findById(jobId);
    if (!job) throw new Error("invalid job id");

    //if job is not active, jobSeeker cannot apply or withdraw
    if (!job.isJobActive) throw new Error("this job is not active");

    //finding if the user has already appied to this job
    const application = await Application.findOne({
      jobId,
      applicantId: _id,
    });

    //if not already applied applying to that job
    if (!application) {
      const appl = new Application({
        jobId,
        applicantId: _id,
        status: "Applied",
      });
      await appl.save();

      job.appliedCount = job.appliedCount + 1; //increasing appliedCount by 1
      if (job.vacancy) job.vacancy = job.vacancy - 1; //decrementing vacancy by 1
      if (job.vacancy == 0) job.isJobActive = false; // if no vacancy left, mark job as inactive
      await job.save();

      res.json({
        message: `Applied successfully`,
        status: "success",
      });
    }
    //if already applied
    else {
      //if the current status is Applied then only withdrawn is possible so deleting the application
      if (application.status == "Applied") {
        await Application.findByIdAndDelete(application._id);

        job.appliedCount = job.appliedCount - 1; //decrementing appliedCount by 1
        if (job.vacancy) job.vacancy = job.vacancy + 1; //incrementing vacancy by 1
        await job.save();

        res.json({
          message: `Job application withdrawn successfully`,
          status: "success",
        });
      }
      // if the current status is not applied can't withdraw
      else throw new Error("cannot withdraw application at this stage");
    }
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const getAppliedJobDetails = async (req, res) => {
  try {
    // application status can be  "Applied", "Shortlisted", "Interviewed", "Rejected",  "Offered"
    const { applicationStatus } = req.query;
    const { user } = req;
    let applications;

    // application status is not provided in query param or it is an invalid value
    if (
      !applicationStatus ||
      !VALID_APPLICATION_STATUS.includes(applicationStatus)
    ) {
      applications = await Application.find({
        applicantId: user._id,
      }).populate({
        path: "jobId",
        populate: {
          path: "companyId",
        },
      });
    }
    //otherwise if the application status provided is valid
    else {
      applications = await Application.find({
        applicantId: user._id,
        status: applicationStatus,
      }).populate({
        path: "jobId",
        populate: {
          path: "companyId",
        },
      });
    }
    if (applications.length == 0) {
      res.json({
        message: `No such applications found for ${user.firstName}`,
        status: "success",
      });
    } else {
      res.json({
        message: `All such applications fetched successfully`,
        status: "success",
        data: applications,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const getPostedJobDetails = async (req, res) => {
  try {
    // job status can be  "Active" or "Inactive"
    const { jobStatus } = req.query;
    const { user } = req;
    let jobs;

    // job status is not provided in query param or it is an invalid value
    if (!jobStatus || (jobStatus != "Active" && jobStatus != "Inactive")) {
      jobs = await Job.find({
        postedById: user._id,
      }).populate({
        path: "companyId",
      });
    } //otherwise if the job status provided is valid
    else {
      const isJobActive = jobStatus == "active" ? true : false;

      jobs = await Job.find({
        postedById: user._id,
        isJobActive,
      }).populate({
        path: "companyId",
      });
    }
    if (jobs.length == 0) {
      res.json({
        message: `No such jobs posted by ${user.firstName} found`,
        status: "success",
      });
    } else {
      res.json({
        message: `All such jobs posted by ${user.firstName} fetched successfully`,
        status: "success",
        data: jobs,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const getApplicantsForThisJob = async (req, res) => {
  try {
    // application status can be  "Applied", "Shortlisted", "Interviewed", "Rejected",  "Offered"
    const { applicationStatus } = req.query;
    const { jobId } = req.body;
    const { user } = req;
    if (!jobId) throw new Error("invalid job Id");
    let applications;

    // application status is not provided in query param or it is an invalid value
    if (
      !applicationStatus ||
      !VALID_APPLICATION_STATUS.includes(applicationStatus)
    ) {
      applications = await Application.find({
        jobId,
      })
        .populate({
          path: "applicantId",
        })
        .populate({
          path: "jobId",
          match: {
            postedById: user._id, // polulate jobId only if it satisfies this condition otherwise jobId will be null
          },
          populate: {
            path: "companyId",
          },
        });
    } // otherwise if the application status is valid
    else {
      applications = await Application.find({
        jobId,
        status: applicationStatus,
      })
        .populate({
          path: "applicantId",
        })
        .populate({
          path: "jobId",
          match: {
            postedById: user._id,
          },
          populate: {
            path: "companyId",
          },
        });
    }
    // removing applications which are not posted by logged in Recruiter
    applications = applications.filter((app) => app.jobId !== null);
    if (applications.length == 0) {
      res.json({
        message: `No applications found for this job`,
        status: "success",
      });
    } else {
      res.json({
        message: `All such applications for this job fetched successfully`,
        status: "success",
        data: applications,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const postJob = async (req, res) => {
  try {
    const jobDetails = req.body;
    const { user } = req;

    //checking if all the provided details are valid or not
    const isPostValid = Object.keys(jobDetails).every((detail) =>
      VALID_JOB_DETAILS.includes(detail)
    );
    if (!isPostValid) throw new Error("invalid job details");

    //companyId is mandatory field
    if (!jobDetails.companyId) throw new Error("company is missing");

    //list of all companies in which the current user/recruiter has permissions to post
    const companiesList = user.companyDetails;

    //checking if the company associated with this job exist in that list
    const canRecruiterPostOpeningsOfThisCompany = companiesList.some(
      (company) => company.companyId == jobDetails.companyId
    );
    if (!canRecruiterPostOpeningsOfThisCompany)
      throw new Error("Recruiter cannot post openings for this company");

    //updating postedById to the id of currently logged in recruiter/user
    jobDetails.postedById = user._id;
    const job = new Job(jobDetails);
    await job.save();
    res.json({
      message: `Job posted successfully by ${user.firstName}`,
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const updateJobDetails = async (req, res) => {
  try {
    //jobDetails are are details rent in request body expect jobId
    const { jobId, ...jobDetails } = req.body;
    const { user } = req;

    //jobId is required
    if (!jobId) throw new Error("job Id is missing");

    //checking if all details can be update or not
    const areDetailsUpdatable = Object.keys(jobDetails).every((detail) =>
      JOB_VALID_UPDATES.includes(detail)
    );
    if (!areDetailsUpdatable)
      throw new Error("some of the details cannot be updated");

    //finding the jobs and updating it(if it exists)
    const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId, postedById: user._id },
      jobDetails,
      {
        runValidators: true,
        returnDocument: "after",
      }
    );

    //if no such job is found or updated values are not valid
    if (!updatedJob) throw new Error("job details cannot be updated");
    res.json({
      message: `Job details updated successfully by ${user.firstName}`,
      status: "success",
      data: updatedJob,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const deleteAJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const { user } = req;

    //jobId is required
    if (!jobId) throw new Error("job Id is missing");

    //finding the jobs and deleting it(if it exists)
    const deletedJob = await Job.findOneAndDelete({
      _id: jobId,
      postedById: user._id,
    });

    //if no such job is found
    if (!deletedJob) throw new Error("job cannot be deleted");

    res.json({
      message: `Job deleted successfully by ${user.firstName}`,
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};
