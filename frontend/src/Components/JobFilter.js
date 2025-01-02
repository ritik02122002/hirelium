import React, { useEffect, useState } from "react";
import {
  DEFAULT_JOB_FILTER,
  DEFAULT_JOB_FILTER_ACCORDION_STATUS,
  JOB_FILTER_INFO,
} from "../utility/constants";
import { getJobs } from "../utility/helper";
import { MdExpandLess } from "react-icons/md";
import { MdExpandMore } from "react-icons/md";

const JobFilter = ({
  setJobs,
  searchText,
  filterData,
  setFilterData,
  currentUser,
  SetAreJobsFetched,
  setPaginationData,
}) => {
  //will keep tract of the current accordion status (which filters are expanded and which are collapsed where true means expanded and false meand collpsed, by default all are expanded)
  const [accordionStatus, setAccordionStatus] = useState(
    DEFAULT_JOB_FILTER_ACCORDION_STATUS
  );

  //invoked when any filter changes to update the filterData object
  const filterJobs = async (e) => {
    //updation logic for radio and range type input as they contain a single value
    if (e.target.type == "radio" || e.target.type == "range") {
      setFilterData({ ...filterData, [e.target.name]: e.target.value });

      //updation logic for checkbox type input as they can contain any number of value(array of values basically)
    } else if (e.target.type == "checkbox") {
      //when filter option is checked
      if (e.target.checked)
        setFilterData({
          ...filterData,
          //adding value
          [e.target.name]: [...filterData[e.target.name], e.target.value],
        });
      //when filter option is unchecked
      else {
        setFilterData({
          ...filterData,
          //removing value
          [e.target.name]: filterData[e.target.name].filter(
            (data) => data != e.target.value
          ),
        });
      }
    }
  };

  //to update the accordian status
  const updateAccordianStatus = (name) => {
    setAccordionStatus({
      ...accordionStatus,
      [name]: !accordionStatus[name],
    });
  };

  //to get the jobs as per filters, searchtext and current user
  const getFilteredJobs = async () => {
    try {
      //not passing the pagination data and page requested as from here we will always request the first page
      const [jobs, pagination] = await getJobs(
        {
          //passing both filters as well as searchText in request as filters are applied on top of search Text. so search text is also required
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
        currentUser
      );
      if (jobs) setJobs(jobs);

      SetAreJobsFetched(true);
      if (pagination) setPaginationData(pagination);
    } catch (err) {
      console.log(err);
    }
  };

  //whenever filter changes or logged in user changes, getting the jobs as per filters and current users
  useEffect(() => {
    getFilteredJobs();
  }, [filterData, currentUser]);

  return (
    <div className="bg-white shadow-lg rounded-md ml-10 px-10 py-1mb-2 mt-10 sticky h-max mb-3">
      <div className="flex justify-between my-7 items-center ">
        <h1 className="text-2xl font-semibold text-gray-700">Filters</h1>

        {/* clear all to reset the filters to their defult value */}
        <p
          className="text-gray-400 ml-10 cursor-pointer"
          onClick={() => setFilterData(DEFAULT_JOB_FILTER)}
        >
          clear all
        </p>
      </div>

      {/* dynamically populates the input elements(i.e filters) as per JOB_FILTER_INFO */}
      {JOB_FILTER_INFO.map((filter) => (
        <>
          <div className="mb-7">
            <hr className="w-full h-0.5 bg-blue-200 mb-4" />
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold my-2 mr-2">
                {filter.title}
              </h1>

              {/* showing collapse or expand icon according to current accordion status of filter and updating the accordion status on click of icon */}
              <div
                onClick={() => updateAccordianStatus(filter.name)}
                className="cursor-pointer"
              >
                {accordionStatus[filter.name] == true ? (
                  <MdExpandLess className="text-2xl" />
                ) : (
                  <MdExpandMore className="text-2xl" />
                )}
              </div>
            </div>

            {/* showing the filter options only when it is expanded */}
            {accordionStatus[filter.name] == true && (
              <div>
                {/* filter structure for range type filters */}
                {filter.type == "range" && (
                  <div className="flex items-center">
                    <input
                      type={filter.type}
                      value={filterData.experience}
                      name={filter.name}
                      id={filter.name}
                      key={filter.name}
                      onChange={filterJobs}
                      min={filter.values[0]}
                      max={filter.values[1]}
                      className=" accent-blue-400 outline-none cursor-pointer appearance-none bg-blue-100 rounded-sm h-2"
                    />
                    <label
                      htmlFor={filter.name}
                      className="ml-2 text-lg text-gray-600 capitalize"
                    >
                      {/* for experience filter showing the max value as "Any" */}
                      {filterData.experience == filter.values[1]
                        ? "Any"
                        : filterData.experience}
                    </label>
                  </div>
                )}
                {/* filter structure for checkbox and radio type filters */}
                {filter.type != "range" &&
                  filter.values.map((val) => (
                    <div className="flex items-center">
                      <input
                        type={filter.type}
                        value={val.value}
                        name={filter.name}
                        id={val.name}
                        key={val.name}
                        onChange={filterJobs}
                        //when to mark filter option as checked
                        checked={
                          (filter.type == "radio" &&
                            filterData[filter.name] == val.value) ||
                          (filter.type == "checkbox" &&
                            filterData[filter.name].includes(val.value))
                        }
                        className=" accent-blue-400"
                      />
                      <label
                        htmlFor={val.name}
                        className="ml-2 text-lg text-gray-600 capitalize"
                      >
                        {val.name}
                      </label>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </>
      ))}
    </div>
  );
};

export default JobFilter;
