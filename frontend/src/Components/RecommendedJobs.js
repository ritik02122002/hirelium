import React, { useContext } from "react";
import useGetItems from "../utility/useGetItems";
import Carousel from "./Carousel";
import AuthContext from "../utility/authContext";
import JobCard from "./JobCard";

const RecommendedJobs = () => {
  const { currentUser } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useGetItems(
    "/job/recommended",
    null,
    []
  );

  return (
    currentUser &&
    currentUser.role == "JobSeeker" &&
    recommendations &&
    recommendations.length > 0 && (
      <div>
        <h1 className="text-3xl w-max m-auto mt-5 mb-2">Recommended Jobs</h1>
        <Carousel
          Element={JobCard}
          elementProps={recommendations.map((job) => ({
            ...job,
            keySkills: null,
            locations: null,
            workModel: null,
            // createdAt: null,
            // jobType: null,
            currentUser: currentUser,

            ...(parseInt(job.jobMatchScore) >= 80
              ? { label: "Excellent Match" }
              : parseInt(job.jobMatchScore) >= 60
              ? { label: "Good match" }
              : parseInt(job.jobMatchScore) >= 50
              ? { label: "Fair Match" }
              : { label: null }),
          }))}
        />
        ;
      </div>
    )
  );
};

export default RecommendedJobs;
