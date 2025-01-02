import React, { useContext } from "react";
import useGetItems from "../utility/useGetItems";
import AuthContext from "../utility/authContext";
import Carousel from "./Carousel";
import JobCard from "./JobCard";
import CompanyCard from "./CompanyCard";

const TopCompanies = () => {
  const { currentUser } = useContext(AuthContext);
  const [companies, setCompanies] = useGetItems("/company/", null, []);

  return (
    companies &&
    companies.length > 0 && (
      <div>
        <h1 className="text-3xl w-max m-auto mt-5 mb-3">Top Companies</h1>
        <Carousel
          Element={CompanyCard}
          width="*:w-[400px]"
          elementProps={companies.map((company) => ({
            companyDetails: { ...company },
          }))}
          backgroundColor="purple"
        />
      </div>
    )
  );
};

export default TopCompanies;
