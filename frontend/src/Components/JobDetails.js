import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import validator from "validator";
import JOB_NOT_FOUND from "../assets/JOB_NOT_FOUND.jpg";
import {
  IMAGE_WITH_INITIALS_URL_PREFIX,
  COVER_LETTER_PLACEHOLDER,
  SERVER_URL,
} from "../utility/constants";
import axios from "axios";
import JobCard from "./JobCard";
import { toast } from "react-toastify";
import { MdOutlineStar } from "react-icons/md";
import Chip from "./Chip";
import { CiClock2, CiLocationOn } from "react-icons/ci";
import { PiBriefcaseThin, PiCurrencyDollarLight } from "react-icons/pi";
import { LiaRupeeSignSolid, LiaUserTieSolid } from "react-icons/lia";
import {
  getDateInWords,
  getSalaryInWords,
  submitJobApplication,
} from "../utility/helper";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import AuthContext from "../utility/authContext";
import { PiMoneyWavyLight } from "react-icons/pi";
import { LiaBusinessTimeSolid } from "react-icons/lia";
import { CiGlobe } from "react-icons/ci";
import { TfiClose } from "react-icons/tfi";
import ToastComponent from "./ToastComponent";
import { JobCardShimmer } from "./Shimmers";

const Detail = ({ fieldName, fieldDetails, isList }) => {
  return fieldDetails != null && fieldDetails.length > 0 ? (
    <div className="mt-5">
      <h2 className="text-xl capitalize mb-1 text-gray-700 font-semibold">
        {fieldName}
      </h2>
      {isList ? (
        <ul className="list-inside list-disc">
          {fieldDetails.map((detail) => (
            <li className="capitalize">{detail}</li>
          ))}
        </ul>
      ) : (
        <p className="capitalize">{fieldDetails}</p>
      )}
    </div>
  ) : null;
};

const JobOverviewItem = ({
  isRange,
  value,
  itemName,
  Logo,
  itemUnit,
  Prefix,
}) => {
  return (isRange == true && (value.from || value.to)) ||
    (isRange == false && value) ? (
    <div className="w-max mx-2 my-2 flex-1">
      <Logo className="text-3xl mx-auto text-blue-500" />
      <div className="w-max mx-auto">
        <p className="text-gray-500 text-center">{itemName}</p>
        <div className="flex items-center justify-center mx-auto">
          {Prefix ? <Prefix className="text-sm" /> : null}
          <p className="font-semibold text-sm text-center">
            {(isRange == true
              ? (value.from || 0) + "" + (value.to ? " - " + value.to : "+")
              : value) +
              " " +
              itemUnit}
          </p>
        </div>
      </div>
    </div>
  ) : null;
};

const JobDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [job, setJob] = useState(null);
  const [isJobStatusChecked, setIsJobStatusChecked] = useState(false);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [isJobApplyContainerVisible, SetIsJobApplyContainerVisible] =
    useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const location = useLocation();
  console.log(location);

  // const submitJobApplication = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.target);
  //   try {
  //     if (isApplied) throw new Error("Already applied to this job");
  //     await axios({
  //       method: "post",
  //       url: SERVER_URL + "/job/toggle/applyWithdraw",
  //       withCredentials: true,
  //       data: {
  //         jobId: job._id,
  //         resumeURL: formData.get("resumeURL"),
  //         coverLetter: formData.get("coverLetter"),
  //         isApplying: true,
  //       },
  //     });
  //     setIsApplied(true);
  //     SetIsJobApplyContainerVisible(false);
  //     toast.success(<ToastComponent />, {
  //       data: {
  //         message: `Application submitted successfully!!`,
  //         route: false,
  //       },
  //     });
  //   } catch (err) {
  //     let message = "Oops! Something went wrong";
  //     if (err?.response?.data?.message) message = err?.response?.data?.message;
  //     toast.error(<ToastComponent />, {
  //       data: { message: message, route: false },
  //       delay: 1000,
  //     });
  //     console.log(err);
  //   }
  // };

  const submitJobApplicationFromDetailsPage = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (isApplied) throw new Error("Already applied to this job");
    const isSuccess = await submitJobApplication(
      _id,
      formData.get("resumeURL"),
      formData.get("coverLetter")
    );
    if (isSuccess) {
      setIsApplied(true);
      SetIsJobApplyContainerVisible(false);
    }
  };

  const JobApplyContainer = () => {
    const [selectedResumeURL, setSelectedResumeURL] = useState("");
    return (
      <>
        <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-15 z-50">
          <div class="bg-white p-6 rounded shadow-lg h-1/2 w-1/2">
            <form onSubmit={submitJobApplicationFromDetailsPage}>
              <div className="flex justify-between">
                <p className="text-gray-600">
                  Applying for{" "}
                  <span className="capitalize font-semibold">{job.title}</span>{" "}
                  position at{" "}
                  <span className="capitalize font-semibold">
                    {job.companyId.name}
                  </span>
                </p>
                <button
                  onClick={() => SetIsJobApplyContainerVisible(false)}
                  className="flex justify-end w-max"
                >
                  <TfiClose className="text-2xl text-blue-500 bg-blue-50 p-1 w-max" />
                </button>
              </div>
              <div className="my-3">
                <p>
                  Choose Resume <span className="text-red-500">*</span>
                </p>
                <div className="flex items-center">
                  <select
                    className="outline-none  px-2 py-2 my-1 text-gray-500 border-[1px] rounded-md border-gray-400"
                    required
                    name="resumeURL"
                    onChange={(e) => {
                      if (e.target.value) {
                        setSelectedResumeURL(e.target.value);
                      }
                    }}
                  >
                    <option className="bg-white text-gray-300" value="">
                      -- SELECT --
                    </option>
                    {currentUser.resumeDetails &&
                      currentUser.resumeDetails.map((resume) => (
                        <option
                          value={resume.resumeURL}
                          className="bg-white text-gray-500"
                        >
                          {resume.resumeDisplayName +
                            (resume.isDefaultResume == true
                              ? " (Default)"
                              : "")}
                        </option>
                      ))}
                  </select>
                  {selectedResumeURL != "" && (
                    <a
                      className="ml-3"
                      href={selectedResumeURL}
                      target="_blank"
                    >
                      <p className="text-blue-500 underline underline-offset-2">
                        {" "}
                        View Resume{" "}
                      </p>
                    </a>
                  )}
                </div>
              </div>
              <div className="my-3">
                <p>
                  Cover Letter (Length from 300 to 5000){" "}
                  {job.isCoverLetterMandatory == true ? (
                    <span className="text-red-500">*</span>
                  ) : null}{" "}
                </p>
                <textarea
                  placeholder={COVER_LETTER_PLACEHOLDER}
                  className="w-full h-32 px-4 py-2 outline-none border-[1px] border-gray-400 rounded-md my-1 resize-none text-gray-500"
                  {...(job.isCoverLetterMandatory == true && {
                    required: true,
                  })}
                  maxLength={"5000"}
                  minLength={"300"}
                  name="coverLetter"
                />
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </>
    );
  };

  const getJobDetails = async () => {
    try {
      const response = await axios({
        method: "get",
        url: SERVER_URL + "/job",
        withCredentials: true,
        params: { jobId: searchParams.get("jobId") },
      });
      console.log(response);
      if (response?.data?.data) setJob(response?.data?.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsJobStatusChecked(true);
    }
  };
  useEffect(() => {
    if (validator.isMongoId(searchParams.get("jobId"))) getJobDetails();
    else setIsJobStatusChecked(true);
  }, []);
  const {
    _id,
    role,
    description,
    qualifications,
    responsibilities,
    postedById,
    companyId,
    salaryDetails,
    additionalInfo,
    workModel,
    minimumExperience,
    maximumExperience,
    jobType,
    locations,
    appliedCount,
    keySkills,
    isJobActive,
    vacancy,
    createdAt,
    title,
  } = job ? job : {};

  return isJobStatusChecked ? (
    job ? (
      <>
        {isJobApplyContainerVisible && <JobApplyContainer />}
        <div
          className={
            "flex w-[80%] mx-auto mt-5 " +
            (isJobApplyContainerVisible && "opacity-30")
          }
        >
          <div className="py-4 px-5  mx-3 mb-2 rounded-md bg-white w-[70%]">
            <div className="flex items-center">
              {companyId &&
                (companyId.logo ? (
                  <img
                    src={companyId.logo}
                    className="h-20 w-20 rounded-md mr-6 object-cover bg-transparent"
                  />
                ) : (
                  <img
                    src={IMAGE_WITH_INITIALS_URL_PREFIX + companyId.name[0]}
                    className="h-20 w-20 rounded-md mr-6 object-cover"
                  />
                ))}
              <div className="w-full">
                {title && (
                  <p className="font-semibold text-2xl capitalize mb-2 text-gray-700">
                    {title}
                  </p>
                )}

                <div className="flex items-center mb-1">
                  {companyId && companyId.name && (
                    <p className="text-xl capitalize text-gray-600 mr-3">
                      {companyId.name}
                    </p>
                  )}
                  {jobType && (
                    <p className="uppercase bg-pink-100 px-3 py-1 text-pink-700 rounded-md font-semibold">
                      {jobType}
                    </p>
                  )}
                </div>
              </div>

              {currentUser != null && currentUser.role == "JobSeeker" && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400 text-xl disabled:cursor-not-allowed "
                  onClick={() => SetIsJobApplyContainerVisible(true)}
                  {...((isJobApplyContainerVisible || isApplied) && {
                    disabled: true,
                  })}
                >
                  {isApplied ? "Applied" : "Apply"}
                </button>
              )}
            </div>

            <Detail fieldName="Job Role" fieldDetails={role} isList={false} />
            <Detail
              fieldName="Job Description"
              fieldDetails={description}
              isList={false}
            />
            {keySkills && keySkills.length != 0 && (
              <div className="mt-4">
                <h2 className="text-xl capitalize mb-2 text-gray-700 font-semibold">
                  Skills
                </h2>
                <p className="first:*:ml-0 flex *:mx-1 flex-wrap">
                  {keySkills.map((skill, indx) => (
                    <Chip value={skill} />
                  ))}
                </p>
              </div>
            )}
            <Detail
              fieldName="Qualifications"
              fieldDetails={qualifications}
              isList={true}
            />
            <Detail
              fieldName="Responsibilities"
              fieldDetails={responsibilities}
              isList={true}
            />
            <Detail
              fieldName="Additional Information"
              fieldDetails={additionalInfo}
              isList={true}
            />
            <Detail
              fieldName="Locations"
              fieldDetails={locations}
              isList={true}
            />
          </div>

          <div className="w-[30%] px-5 py-3 h-max shadow-blue-500 shadow-inner rounded-md">
            <h2 className="text-2xl text-blue-500 mb-5 text-center font-semibold">
              Job Overview
            </h2>
            <div className="flex items-center my-1 mx-1 *:text-gray-600 flex-wrap">
              <JobOverviewItem
                isRange={true}
                itemUnit="Years"
                itemName="Experience"
                Logo={PiBriefcaseThin}
                value={{ from: minimumExperience, to: maximumExperience }}
              />
              <JobOverviewItem
                isRange={true}
                itemUnit={jobType == "Full-time" ? "p.a." : "p.m."}
                itemName="Salary"
                Logo={PiMoneyWavyLight}
                value={{
                  from: getSalaryInWords(salaryDetails.minimumSalary, jobType),
                  to: getSalaryInWords(salaryDetails.maximumSalary, jobType),
                }}
                Prefix={
                  salaryDetails.currency == "INR"
                    ? LiaRupeeSignSolid
                    : PiCurrencyDollarLight
                }
              />

              <JobOverviewItem
                isRange={false}
                itemUnit=""
                itemName="Work Mode"
                Logo={CiGlobe}
                value={workModel}
              />

              <JobOverviewItem
                isRange={false}
                itemUnit=""
                itemName="Applicant"
                Logo={LiaUserTieSolid}
                value={appliedCount}
              />

              <JobOverviewItem
                isRange={false}
                itemUnit="ago"
                itemName="Posted"
                Logo={HiOutlineCalendarDateRange}
                value={getDateInWords(
                  new Date(Date.now()) - new Date(createdAt)
                )}
              />

              <JobOverviewItem
                isRange={false}
                itemUnit=""
                itemName="Vacancy"
                Logo={LiaBusinessTimeSolid}
                value={vacancy}
              />
            </div>
          </div>
        </div>
      </>
    ) : (
      <img src={JOB_NOT_FOUND} className="h-96 w-96 mx-auto my-10" />
    )
  ) : (
    <JobCardShimmer />
  );
};

export default JobDetails;
