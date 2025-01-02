import React, { useContext, useState } from "react";
import {
  DEFAULT_JOB_FILTER,
  DEFAULT_PAGINATION_DATA,
  SERVER_URL,
} from "../utility/constants";
import axios from "axios";
import JobCard from "./JobCard";
import JobFilter from "./JobFilter";
import Searchbar from "./Searchbar";
import AuthContext from "../utility/authContext";
import { getJobs } from "../utility/helper";
import NO_JOBS_FOUND from "../assets/NO_JOBS_FOUND.jpg";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { JobCardShimmer } from "./Shimmers";

const JobsList = () => {
  //will contain the list of jobs that should be shown on the screen(will keep on changing as per the user,search text or filters changes )
  const [jobs, setJobs] = useState([]);

  //will store the serch text of the search bar (will keep on changing as user types/delete from searchbar)
  const [searchText, setSearchText] = useState("");

  //will store info regarding currently applied filters
  const [filterData, setFilterData] = useState(DEFAULT_JOB_FILTER);

  //will store the status whether job fetched or not (used to show shimmers for the time jobs are being fetched)
  const [areJobsFetched, SetAreJobsFetched] = useState(false);

  //will keep track of the current page so that user can go to previous and next pages
  const [paginationData, setPaginationData] = useState(DEFAULT_PAGINATION_DATA);

  const { currentUser, setCurrentUser } = useContext(AuthContext);

  //invoked when user searches something (clicks on search button)
  const getJobSearchResults = async (e) => {
    try {
      //prevents default behaviour of form on submit
      e.preventDefault();

      //fetching the jobs as per the search text and current User
      //passing only search text and not filters as filters are applied on top of searched results
      //not passing any info related to pagination as from here we will always request first page
      const [jobs, pagination] = await getJobs(
        {
          searchText,
        },
        currentUser
      );

      //setting the jobs
      if (jobs) setJobs(jobs);

      SetAreJobsFetched(true);

      if (pagination) setPaginationData(pagination);

      //when user searches something filters are resetted to default (user should first search something and then apply filters on the searched results)
      setFilterData(DEFAULT_JOB_FILTER);

      //if the user is logged in and search text is not empty then updating the user Search history
      if (currentUser && searchText) {
        await axios({
          method: "post",
          url: SERVER_URL + "/job/search",
          data: { keyword: searchText },
          withCredentials: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  //to change page on click of next or previous button i.e pageRequested is previous or next
  const changePage = async (pageRequested) => {
    try {
      //sending filters and searchText both as page changes happen over these two
      //sending paginatiuon data of current page and page requested as now it is required to get the next or previous page
      const [jobs, pagination] = await getJobs(
        {
          filters: {
            workModel: filterData.workModel,
            jobType: filterData.jobType,
            minimumSalary: filterData.minimumSalary,
            vacancy: filterData.vacancy,
            createdAt: filterData.createdAt,
            experience: filterData.experience,
          },
          searchText,
        },
        currentUser,
        paginationData,
        pageRequested
      );
      if (jobs) setJobs(jobs);
      SetAreJobsFetched(true);
      if (pagination) setPaginationData(pagination);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="">
      <h1 className="text-5xl mt-10 font-semibold pl-10">
        Find your <span className="text-blue-500">perfect job </span>today
      </h1>
      <p className="text-xl mt-3 mb-10 pl-10 first-letter:text-2xl">
        Because the perfect job deserves the perfect match
      </p>
      <Searchbar
        searchText={searchText}
        setSearchText={setSearchText}
        getResults={getJobSearchResults}
      />
      <div className="flex mt-6 bg-gray-50 h-min max-h-min">
        <JobFilter
          setJobs={setJobs}
          searchText={searchText}
          filterData={filterData}
          setFilterData={setFilterData}
          currentUser={currentUser}
          SetAreJobsFetched={SetAreJobsFetched}
          setPaginationData={setPaginationData}
        />
        <div className=" mt-10  mb-4">
          {areJobsFetched ? (
            jobs.length > 0 ? (
              <>
                {/* jobs are fetched and at least one job is avavilable , then show jobs */}
                <div className="flex flex-wrap max-w-full min-w-min justify-between">
                  {jobs.map((job) => (
                    <JobCard
                      jobDetails={{ ...job, keySkills: null }}
                      currentUser={currentUser}
                      key={job._id}
                    />
                  ))}
                </div>
                <div className="flex justify-center my-4">
                  {/* prevous page button - to be only enabled if previous page exist, and will fetch the jobs on previous page */}
                  <button
                    className="flex items-center bg-white text-blue-500 px-4 py-2 rounded-sm cursor-pointer hover:text-blue-400 hover:border-blue-400 border-blue-500 border-2 box-content  mx-1 disabled:border-blue-300 disabled:text-blue-400 disabled:hover:text-blue-100 disabled:hover:border-blue-100 disabled:hover:border-2 disabled:cursor-not-allowed"
                    {...(paginationData.hasPrevious == false && {
                      disabled: true,
                    })}
                    //page is changed to previous page
                    onClick={() => changePage("previous")}
                  >
                    <GrPrevious className="text-lg" />
                    <p className="text-lg ml-1">Previous</p>
                  </button>

                  {/* next page button - to be only enabled if next page exist, and will fetch the jobs on next page */}
                  <button
                    {...(paginationData.hasNext == false && { disabled: true })}
                    className="flex items-center bg-white text-blue-500 px-4 py-2 rounded-sm cursor-pointer hover:text-blue-400 hover:border-blue-400 border-blue-500 border-2 box-content  mx-1 disabled:border-blue-300 disabled:text-blue-400 disabled:hover:text-blue-100 disabled:hover:border-blue-100 disabled:hover:border-2 disabled:cursor-not-allowed"
                    //page is changed to next page
                    onClick={() => changePage("next")}
                  >
                    <p className="text-lg mr-1">Next</p>
                    <GrNext className="text-lg" />
                  </button>
                </div>
              </>
            ) : (
              //jobs fetchhed but no job available then show no jobs found page
              <img src={NO_JOBS_FOUND} className="h-96 w-96 rounded-md mx-10" />
            )
          ) : (
            //if jobs are not fetched showing shimmers
            <>
              {[...Array(10)].map(() => (
                <JobCardShimmer />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsList;
