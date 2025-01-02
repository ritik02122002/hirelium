import axios from "axios";
import { IMAGE_WITH_INITIALS_URL_PREFIX, SERVER_URL } from "./constants";
import { useContext } from "react";
import AuthContext from "./authContext";
import ToastComponent from "../Components/ToastComponent";
import { toast } from "react-toastify";

export const getDateInWords = (dateDifference) => {
  if (!dateDifference) return null;
  let period = dateDifference / (60 * 1000);

  period = parseInt(period);
  if (period < 60) return `${period} min` + (period > 1 ? "s" : "");

  period /= 60;
  period = parseInt(period);
  if (period < 24) return `${period} hour` + (period > 1 ? "s" : "");

  period /= 24;
  period = parseInt(period);
  if (period <= 30) return `${period} day` + (period > 1 ? "s" : "");

  period /= 30.5;
  period = parseInt(period);
  if (period < 12) return `${period} month` + (period > 1 ? "s" : "");

  period /= 12;
  period = parseInt(period);
  return `${period} year` + (period > 1 ? "s" : "");
};

export const getSalaryInWords = (salary, jobType) => {
  if (!salary) return null;
  let s = salary / 1000;
  if (jobType == "Internship") s /= 12;

  if (s < 100) return `${parseInt(s * 10) / 10}k`;
  s /= 100;
  if (s < 100) return `${parseInt(s * 10) / 10}L`;
  s /= 100;
  return `${parseInt(s * 10) / 10}Cr`;
};

export const getRatingColor = (rating) => {
  if (rating == 5) return "text-green-950";
  if (rating > 4) {
    return `text-green-${100 * (parseInt(rating * 10) % 10)}`;
  }
  if (rating == 4) return "text-green-50";
  if (rating > 3) {
    return `text-yellow-${100 * (parseInt(rating * 10) % 10)}`;
  }
  if (rating == 3) return "text-yellow-50";
  if (rating > 2) {
    return `text-orange-${100 * (parseInt(rating * 10) % 10)}`;
  }
  if (rating == 2) return "text-orange-50";
  if (rating > 1) {
    return `text-red-${100 * (parseInt(rating * 10) % 10)}`;
  }
  return;
};

// const getFilteredJobs = async () => {
//   try {
//     console.log(filterData);
//     console.log(searchText);
//     console.log("called");
//     const response = await axios({
//       method: "get",
//       url: SERVER_URL + "/job/filter",
//       withCredentials: true,
//       params: {
//         filters: {
//           workModel: filterData.workModel,
//           jobType: filterData.jobType,
//           minimumSalary: filterData.minimumSalary,
//           vacancy: filterData.vacancy,
//           createdAt: filterData.createdAt,
//         },
//         searchText,
//       },
//     });
//     if (response?.data?.data) setJobs(response?.data?.data);
//   } catch (err) {
//     console.log(err);
//   }
// };

// const getJobSearchResults = async (e) => {
//   try {
//     e.preventDefault();
//     const response = await axios({
//       method: "get",
//       url: SERVER_URL + "/job/filter",
//       params: {
//         searchText,
//       },
//     });
//     setJobs(response?.data?.data);
//     setFilterData({
//       workModel: [],
//       jobType: [],
//       minimumSalary: "Any",
//       vacancy: [],
//       createdAt: "Any",
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

export const getJobs = async (
  params,
  currentUser,
  paginationData,
  pageRequested
) => {
  try {
    //will conatin details regarding pagination
    //if page requested is null or invalid we take it as we are requesting the first page and first page does not require any pagination deatails to fetch results
    let paginationDetails = {};
    if (pageRequested == "next") {
      if (paginationData.hasNext == false)
        throw new Error("previous page doesn't exist");
      paginationDetails = {
        pageRequested: "next",
        cursor: paginationData.nextCursor,
      };
    } else if (pageRequested == "previous") {
      if (paginationData.hasPrevious == false)
        throw new Error("previous page doesn't exist");
      paginationDetails = {
        pageRequested: "previous",
        cursor: paginationData.previousCursor,
      };
    }
    const response = await axios({
      method: "get",
      url:
        SERVER_URL +
        "/job/filter" +
        (currentUser && currentUser?.role == "JobSeeker" ? "/jobSeeker" : ""), // seperate api for jobSeeker and non jobSeeker as for jobSeeker we have to exclude the jobs for which jobSeeker has already applied
      withCredentials: true,
      params: { ...params, ...paginationDetails }, // sending all the details (filter details,search text, pagination details) in params as it is a get request
    });
    console.log(response);
    if (response?.data?.data)
      return [response?.data?.data, response?.data?.pagination]; // returning jobs fetched as well as pagination details as an array
    return [null, null];
  } catch (err) {
    console.log(err);
    return [null, null];
  }
};

export const submitJobApplication = async (id, resumeURL, coverLetter) => {
  try {
    await axios({
      method: "post",
      url: SERVER_URL + "/job/toggle/applyWithdraw",
      withCredentials: true,
      data: {
        jobId: id,
        resumeURL: resumeURL,
        coverLetter: coverLetter,
        isApplying: true,
      },
    });
    toast.success(<ToastComponent />, {
      data: {
        message: `Application submitted successfully!!`,
        route: false,
      },
    });
    return true;
  } catch (err) {
    let message = "Oops! Something went wrong";
    if (err?.response?.data?.message) message = err?.response?.data?.message;
    toast.error(<ToastComponent />, {
      data: { message: message, route: false },
      delay: 1000,
    });
    return false;
  }
};

export const getPrefixImageUrl = (name) => {
  return IMAGE_WITH_INITIALS_URL_PREFIX + name[0];
};
