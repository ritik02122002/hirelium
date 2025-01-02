import Application from "../models/ApplicationModel.js";
import Company from "../models/CompanyModel.js";
import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";
import {
  DEFAULT_PAGE,
  DEFAULT_RESULT_LIMIT,
  JOB_VALID_UPDATES,
  VALID_APPLICATION_STATUS,
  VALID_JOB_DETAILS,
  VALID_JOB_FILTERS,
} from "../utils/constant.js";
import { getJobUserMatch, getMinMaxFromRange } from "../utils/helper.js";
import validator from "validator";

export const getAllActiveJobs = async (req, res) => {
  try {
    let { page, limit } = req.query;

    limit = parseInt(limit) || DEFAULT_RESULT_LIMIT;
    page = parseInt(page) || DEFAULT_PAGE;
    const skip = limit * (page - 1);

    //finding all active jobs
    const jobs = await Job.find({ isJobActive: true })
      .skip(skip)
      .limit(limit)
      .populate("companyId");

    //no active job found
    if (jobs.length == 0)
      res.json({
        message: `No results found on page ${page}`,
        status: "success",
      });
    //otherwise return all active jobs
    else
      res.json({
        message: `Jobs on page ${page} fetched successfully`,
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
    console.log(req.body);
    const { jobId, resumeURL, coverLetter, isApplying } = req.body;
    const { _id } = req.user;
    if (!jobId) throw new Error("Please provide jobId");
    if (!resumeURL) throw new Error("Please select a Resume");
    if (!(isApplying == true || isApplying == false))
      throw new Error("please state whether applying or withdrawing");

    //finding that job
    let job = await Job.findById(jobId);
    if (!job) throw new Error("invalid job id");

    //if job is not active, jobSeeker cannot apply or withdraw
    if (!job.isJobActive) throw new Error("This job is not active");

    //finding if the user has already appied to this job
    const application = await Application.findOne({
      jobId,
      applicantId: _id,
    });

    let app = {
      jobId,
      applicantId: _id,
      resumeURL,
      status: "Applied",
    };
    if (coverLetter) app.coverLetter = coverLetter;

    //if not already applied applying to that job
    if (!application && isApplying) {
      const appl = new Application(app);
      await appl.save();

      job.appliedCount = job.appliedCount + 1; //increasing appliedCount by 1
      // if (job.vacancy) job.vacancy = job.vacancy - 1; //decrementing vacancy by 1
      // if (job.vacancy == 0) job.isJobActive = false; // if no vacancy left, mark job as inactive
      await job.save();

      res.json({
        message: `Applied successfully to ${job.title}(${job.role})`,
        status: "success",
      });
    }
    //if already applied
    else if (application && !isApplying) {
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
    } else
      throw new Error(
        "Already " + (isApplying == true ? "applied to this job" : "withdrawn")
      );
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
    let { page, limit } = req.query;

    limit = parseInt(limit) || DEFAULT_RESULT_LIMIT;
    page = parseInt(page) || DEFAULT_PAGE;

    const skip = (page - 1) * limit;
    let applications;

    // application status is not provided in query param or it is an invalid value
    if (
      !applicationStatus ||
      !VALID_APPLICATION_STATUS.includes(applicationStatus)
    ) {
      applications = await Application.find({
        applicantId: user._id,
      })
        .skip(skip)
        .limit(limit)
        .populate({
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
      })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "jobId",
          populate: {
            path: "companyId",
          },
        });
    }
    if (applications.length == 0) {
      res.json({
        message: `No applications found for ${user.firstName} on page ${page}`,
        status: "success",
      });
    } else {
      res.json({
        message: `Applications on page ${page} fetched successfully`,
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
    let { page, limit } = req.query;

    limit = parseInt(limit) || DEFAULT_RESULT_LIMIT;
    page = parseInt(page) || DEFAULT_PAGE;

    const skip = (page - 1) * limit;
    let jobs;

    // job status is not provided in query param or it is an invalid value
    if (!jobStatus || (jobStatus != "Active" && jobStatus != "Inactive")) {
      jobs = await Job.find({
        postedById: user._id,
      })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "companyId",
        });
    } //otherwise if the job status provided is valid
    else {
      const isJobActive = jobStatus == "Active" ? true : false;

      jobs = await Job.find({
        postedById: user._id,
        isJobActive,
      })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "companyId",
        });
    }
    if (jobs.length == 0) {
      res.json({
        message: `No jobs posted by ${user.firstName} found on page ${page}`,
        status: "success",
      });
    } else {
      res.json({
        message: `Jobs posted by ${user.firstName} on page ${page} fetched successfully`,
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
    let { page, limit } = req.query;

    limit = parseInt(limit) || DEFAULT_RESULT_LIMIT;
    page = parseInt(page) || DEFAULT_PAGE;

    const skip = (page - 1) * limit;
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

    if (applications.length <= skip) {
      return res.json({
        message: `No results found on page ${page}`,
        status: "success",
      });
    }

    //calculating the applicant Match score with the job for each applicant
    applications.forEach(
      (application, index, applications) =>
        (applications[index] = {
          ...application.toObject(),
          jobMatchScore: getJobUserMatch(
            application.jobId,
            null,
            application.applicantId.skills
          ),
        })
    );

    //at last sorting the applications in decreasing order of job match score
    applications.sort(function (application1, application2) {
      return application2.jobMatchScore - application1.jobMatchScore;
    });

    const applicationsPaginated = applications.slice(
      skip,
      Math.min(skip + limit, applications.length)
    );

    res.json({
      message: `Applications for this job on page ${page} fetched successfully`,
      status: "success",
      data: applicationsPaginated,
    });
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
  // const session = await mongoose.startSession(); // Start a session
  // session.startTransaction(); // Begin a transaction

  try {
    const { jobId } = req.body;
    const { user } = req;

    //jobId is required
    if (!jobId) throw new Error("job Id is missing");

    //finding the jobs and deleting it(if it exists)
    const deletedJob = await Job.findOneAndDelete(
      {
        _id: jobId,
        postedById: user._id,
      }
      // { session } // Using the session for this operation
    );

    //if no such job is found
    if (!deletedJob) throw new Error("job cannot be deleted");

    //also deleting all the applications corresponding to this jobId
    await Application.findOneAndDelete(
      {
        jobId: jobId,
      }
      // { session } // Using the session for this operation
    );

    // await session.commitTransaction();
    res.json({
      message: `Job along with all its job Applications deleted successfully by ${user.firstName}`,
      status: "success",
    });
  } catch (err) {
    // Rolling back the transaction in case of any error
    // await session.abortTransaction();

    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
  // finally {
  //   session.endSession(); // End the session
  // }
};

export const getAllActiveNotAppliedJobs = async (req, res) => {
  try {
    const { user } = req;
    let { page, limit } = req.query;

    limit = parseInt(limit) || DEFAULT_RESULT_LIMIT;
    page = parseInt(page) || DEFAULT_PAGE;

    const skip = (page - 1) * limit;

    //finds all user applications
    const userApplications = await Application.find({ applicantId: user._id });

    //filter ids of all the jobs applied by users
    const userAppliedjobIds = userApplications.map(
      (application) => application.jobId
    );

    //finding all jobs which are not yet applied by user
    const jobs = await Job.find({
      isJobActive: true,
      _id: { $nin: userAppliedjobIds },
    })
      .skip(skip)
      .limit(limit)
      .populate("companyId");

    if (jobs.length == 0) {
      return res.json({
        message: `No results found on page ${page}`,
        status: "success",
      });
    }

    res.json({
      message: `Active Jobs not applied by ${user.firstName} on page ${page} fetched successfully`,
      status: "success",
      data: jobs,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const getJobRecommendations = async (req, res) => {
  try {
    const { user } = req;
    let { page, limit } = req.query;

    limit = parseInt(limit) || DEFAULT_RESULT_LIMIT;
    page = parseInt(page) || DEFAULT_PAGE;

    const skip = (page - 1) * limit;

    //finds all user applications
    const userApplications = await Application.find({ applicantId: user._id });

    //filter ids of all the jobs applied by users
    const userAppliedjobIds = userApplications.map(
      (application) => application.jobId
    );

    //finding all jobs which are not yet applied by user
    const jobs = await Job.find({
      isJobActive: true,
      _id: { $nin: userAppliedjobIds },
    }).populate("companyId");

    if (jobs.length <= skip) {
      return res.json({
        message: `No results found on page ${page}`,
        status: "success",
      });
    }

    //calculating the job Match score with user preferences and skills for each job
    jobs.forEach(
      (job, index, jobs) =>
        (jobs[index] = {
          ...job.toObject(),
          jobMatchScore: getJobUserMatch(job, user.jobPreferences, user.skills),
        })
    );

    //at last sorting the jobs in decreasing order of job match score
    jobs.sort(function (job1, job2) {
      return job2.jobMatchScore - job1.jobMatchScore;
    });

    const jobsPaginated = jobs.slice(skip, Math.min(skip + limit, jobs.length));

    res.json({
      message: `Recommendations for ${user.firstName} on page ${page} fetched successfully`,
      status: "success",
      data: jobsPaginated,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const saveSearchKeyword = async (req, res) => {
  try {
    const { user } = req;
    let { keyword } = req.body;
    if (!keyword) throw new Error("keyword is missing");
    keyword = keyword.trim();
    let { searchHistory } = user;
    if (!searchHistory || searchHistory.length == 0) {
      searchHistory = [keyword];
    } else {
      const indx = searchHistory.indexOf(keyword.toLowerCase());
      if (indx != -1) {
        searchHistory.splice(indx, 1);
      }
      searchHistory.unshift(keyword);
    }
    if (searchHistory.length > 10) searchHistory.pop();
    const updatedUserDetails = await User.findByIdAndUpdate(
      user._id,
      { searchHistory },
      {
        runValidators: true,
        returnDocument: "after",
      }
    ).select("-password");
    res.json({
      message: `Search History of ${user.firstName} updated successfully`,
      status: "success",
      data: updatedUserDetails,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const getFilteredJobs = async (req, res) => {
  try {
    console.log(req.query.searchText);
    const { filters, searchText } = req.query;

    //if cursor is absent first page is returned
    //Using cursor as mongoDb Object ID for this API
    //using cursor based pagination
    let { cursor, limit, pageRequested } = req.query; //pageRequested can be "previous" or "next"

    if (
      !(
        !pageRequested ||
        pageRequested == "previous" ||
        pageRequested == "next"
      )
    )
      throw new Error("invalid page requested");

    if (cursor) {
      if (!validator.isMongoId(cursor)) throw new Error("invalid cursor");
    }

    limit = parseInt(limit) || DEFAULT_RESULT_LIMIT;
    limit = Math.min(limit, 20);

    let sortOrder = { _id: "asc" };
    let resultQuery = {};

    if (pageRequested == "previous") {
      sortOrder = { _id: "desc" };
      resultQuery = { _id: { $lt: cursor } };
    } else if (pageRequested == "next") {
      resultQuery = { _id: { $gt: cursor } };
    }

    let keyword = searchText;
    let obj = {};
    let searchObj = {};

    let userAppliedJobs = [];
    if (req.user) {
      userAppliedJobs = await Application.find(
        { applicantId: req.user._id },
        "jobId"
      );
      userAppliedJobs = userAppliedJobs.map((appl) => appl.jobId);
    }

    if (keyword) {
      keyword = keyword.replaceAll(" ", "|");
      keyword = keyword.toLowerCase();
      const companyIds = await Company.find(
        {
          name: { $regex: keyword, $options: "i" },
        },
        "_id"
      );

      searchObj.$or = [
        { role: { $regex: keyword, $options: "i" } },
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { keySkills: { $elemMatch: { $regex: keyword, $options: "i" } } },
        { locations: { $elemMatch: { $regex: keyword, $options: "i" } } },
        { companyId: { $in: companyIds } },
      ];
    }
    if (filters) {
      //validating filters
      console.log(filters);
      console.log(typeof filters["createdAt"]);

      let areFiltersValid = true;
      VALID_JOB_FILTERS.forEach((filter) => {
        if (filters.hasOwnProperty(filter.name)) {
          if (Array.isArray(filters[filter.name])) {
            const areFilterValuesValid = filters[filter.name].every(
              (filterValue) => filter.values.includes(filterValue)
            );
            if (!areFilterValuesValid) {
              areFiltersValid = false;
            }
          } else {
            const areFilterValuesValid = filter.values.includes(
              filters[filter.name]
            );
            if (!areFilterValuesValid) {
              areFiltersValid = false;
            }
          }
        }
      });

      if (!areFiltersValid) throw new Error("Invalid filters");

      if (filters.jobType && filters.jobType.length > 0) {
        obj.jobType = { $in: filters.jobType };
      }
      if (filters.workModel && filters.workModel.length > 0) {
        obj.workModel = { $in: filters.workModel };
      }
      if (filters.createdAt && filters.createdAt != "Any")
        obj.createdAt = { $gte: new Date() - parseInt(filters.createdAt) };

      if (filters.experience && filters.experience != "51") {
        obj.maximumExperience = { $gte: parseInt(filters.experience) };
        obj.minimumExperience = { $lte: parseInt(filters.experience) };
      }

      if (filters.minimumSalary && filters.minimumSalary != "Any")
        obj["salaryDetails.minimumSalary"] = {
          $gte: parseInt(filters.minimumSalary * 12),
        };
      if (filters.vacancy && filters.vacancy.length > 0)
        obj.$or = filters.vacancy.map((v) => ({
          vacancy: {
            $gte: parseInt(getMinMaxFromRange(v)[0]),
            $lte: parseInt(getMinMaxFromRange(v)[1]),
          },
        }));
    }

    let result = await Job.find({
      $and: [obj, searchObj],
      _id: { $nin: userAppliedJobs },
      isJobActive: true,
      ...resultQuery,
    })
      .sort(sortOrder)
      .limit(limit + 1)
      .populate("companyId");

    if (result.length == 0)
      return res.json({
        message: `No job found`,
        status: "success",
        data: result,
        pagination: {
          hasNext: false,
          hasPrevious: false,
        },
      });

    let paginationData = {};
    if (result.length == limit + 1) {
      if (!pageRequested) {
        paginationData = {
          hasNext: true,
          hasPrevious: false,
          nextCursor: result[limit - 1]._id,
          previousCursor: result[0]._id,
        };
      } else
        paginationData = {
          hasNext: true,
          hasPrevious: true,
          nextCursor:
            pageRequested == "next" ? result[limit - 1]._id : result[0]._id,
          previousCursor:
            pageRequested == "next" ? result[0]._id : result[limit - 1]._id,
        };
    } else {
      if (!pageRequested)
        paginationData = {
          hasNext: false,
          hasPrevious: false,
          nextCursor: result[result.length - 1]._id,
          previousCursor: result[0]._id,
        };
      else if (pageRequested == "previous")
        paginationData = {
          hasNext: true,
          hasPrevious: false,
          nextCursor: result[0]._id,
          previousCursor: result[result.length - 1]._id,
        };
      else if (pageRequested == "next") {
        paginationData = {
          hasNext: false,
          hasPrevious: true,
          nextCursor: result[result.length - 1]._id,
          previousCursor: result[0]._id,
        };
      }
    }
    if (result.length == limit + 1) result.pop();

    res.json({
      message: `Jobs fetched successfully`,
      status: "success",
      data: result,
      pagination: paginationData,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const getJobDetails = async (req, res) => {
  try {
    const { jobId } = req.query;
    if (!jobId) throw new Error("Job Id absent");

    const job = await Job.findById(jobId).populate("companyId");
    if (!job) throw new Error("Job does not exist");

    res.json({
      message: `Job details fetched successfully`,
      status: "success",
      data: job,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};
