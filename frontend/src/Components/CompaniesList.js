import React from "react";
import CompanyCard from "./CompanyCard";
import useGetItems from "../utility/useGetItems";

const CompaniesList = () => {
  const [companies, setCompanies] = useGetItems("/company/", null, []);

  return (
    companies &&
    companies.length > 0 && (
      <div className="flex w-full flex-wrap">
        {companies.map((company) => (
          <CompanyCard companyDetails={company} key={company._id} />
        ))}
      </div>
    )
  );
};

export default CompaniesList;
