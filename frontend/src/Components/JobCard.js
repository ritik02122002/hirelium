import React from "react";
import { CiLocationOn } from "react-icons/ci";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { PiBriefcaseThin } from "react-icons/pi";
import { LiaUserTieSolid } from "react-icons/lia";
import { PiCurrencyDollarLight } from "react-icons/pi";
import Chip from "./Chip";
import { CiClock2 } from "react-icons/ci";
import { IoIosRocket } from "react-icons/io";
import {
  getDateInWords,
  getPrefixImageUrl,
  getSalaryInWords,
  submitJobApplication,
} from "../utility/helper";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { Link } from "react-router-dom";

const JobCard = ({ jobDetails, currentUser, jobLabel = null }) => {
  const {
    _id,
    companyId,
    salaryDetails,
    workModel,
    minimumExperience,
    maximumExperience,
    jobType,
    locations,
    appliedCount,
    keySkills,
    vacancy,
    createdAt,
    title,
    isCoverLetterMandatory,
  } = jobDetails || {};
  const { logo: companyLogo, name: companyName } = companyId || {};
  const { maximumSalary, minimumSalary, currency } = salaryDetails || {};
  const { role, defaultResume } = currentUser || {};

  const submitJobApplicationFromJobsPage = async () => {
    await submitJobApplication(_id, defaultResume, "");
  };

  return (
    <div className="py-4 px-5  mx-7 mb-2 rounded-md shadow-md bg-white flex-1 min-w-max max-w-[full]">
      <div className="flex">
        <img
          src={companyLogo ? companyLogo : getPrefixImageUrl(companyName)}
          className="h-14 w-14 rounded-md mr-6 object-cover"
        />
        <div className=" w-full">
          <div className="flex items-center mb-1">
            <p className="text-lg capitalize text-gray-600">{companyName}</p>
            {jobLabel ? (
              <p className="capitalize bg-pink-100 px-2 py-1 text-pink-700 rounded-md ml-2 text-sm font-semibold">
                {jobLabel}
              </p>
            ) : null}
          </div>

          <p className="font-semibold text-xl capitalize mb-2 text-gray-700">
            {title}
          </p>

          {keySkills && keySkills.length != 0 ? (
            <p className="first:*:ml-0 flex *:mx-1 flex-wrap">
              {keySkills.map((skill, indx) =>
                //showing max 5 skills
                indx >= 5 ? null : <Chip value={skill} />
              )}
            </p>
          ) : null}

          <div className="flex items-center *:mr-4 my-1 *:text-gray-600 flex-wrap">
            <div className="flex items-center">
              <CiClock2 className="text-lg mr-1" />
              <p className="capitalize">{jobType}</p>
            </div>
            {minimumExperience || maximumExperience ? (
              <div className="flex items-center">
                <PiBriefcaseThin className="text-lg mr-1" />
                <p>
                  {minimumExperience || 0}
                  {maximumExperience ? " - " + maximumExperience : "+"} {" yrs"}
                </p>
              </div>
            ) : null}
            {minimumSalary || maximumSalary ? (
              <div className="flex items-center">
                {currency == "INR" ? (
                  <LiaRupeeSignSolid className="text-lg" />
                ) : (
                  <PiCurrencyDollarLight className="text-lg" />
                )}
                <p>
                  {minimumSalary ? getSalaryInWords(minimumSalary, jobType) : 0}
                  {maximumSalary
                    ? " - " + getSalaryInWords(maximumSalary, jobType)
                    : "+"}{" "}
                  {jobType == "Full-time" ? "p.a." : "p.m."}
                </p>
              </div>
            ) : (
              //if salary deatils are not provided in job detailsm showing not disclosed
              <div className="flex items-center">
                <PiCurrencyDollarLight className="text-lg" />
                <p>Not Disclosed</p>
              </div>
            )}
            {workModel ? <p>{workModel}</p> : null}
          </div>

          {locations && locations.length != 0 ? (
            <div className="flex items-center *:text-gray-600">
              <CiLocationOn className="text-lg mr-1" />
              <p className="flex *:mx-1 capitalize flex-wrap">
                {/* //joining locations by |  */}
                {locations.join(" | ")}
              </p>
            </div>
          ) : null}

          <div className="flex items-center *:mr-4 my-1 *:text-gray-600 flex-wrap">
            <div className="flex items-center">
              <LiaUserTieSolid className="text-lg" />
              <p>
                {appliedCount == 0 ? "No " : appliedCount}{" "}
                {appliedCount > 1 ? "Applicants" : "Applicant"}
              </p>
            </div>

            {vacancy ? (
              <p>
                {vacancy} {vacancy > 1 ? "Positions" : "Position"}
              </p>
            ) : null}

            {createdAt ? (
              <div className="flex items-center">
                <HiOutlineCalendarDateRange className="text-lg mr-1" />
                <p>
                  {getDateInWords(new Date(Date.now()) - new Date(createdAt)) +
                    " ago"}
                </p>
              </div>
            ) : null}
          </div>
          <div className="flex items-center *:mr-4 mt-3 ">
            <Link to={"/job/details?jobId=" + _id}>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-400">
                View Details
              </button>
            </Link>
            {/* showing jobSeeker the option to quickly apply from job page itself if jobSeeker has a default resume and the job does not require a cover letter   */}
            {currentUser != null &&
            role == "JobSeeker" &&
            defaultResume &&
            isCoverLetterMandatory == false ? (
              <button
                className="flex bg-white text-blue-500 px-4 py-2 rounded-md cursor-pointer hover:text-blue-400 hover:border-blue-400 border-blue-500 border-2 box-content items-center"
                onClick={() => submitJobApplicationFromJobsPage()}
              >
                <p className="mr-1">Quick Apply</p>
                <IoIosRocket className="text-xl" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
