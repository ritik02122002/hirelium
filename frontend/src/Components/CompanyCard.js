import React from "react";
import { getPrefixImageUrl } from "../utility/helper";

const CompanyCard = ({ companyDetails }) => {
  const { name, rating, logo, description } = companyDetails || {};
  return (
    <div className="bg-white px-4 py-3 mx-2 my-1 flex-1  box-content shadow-lg min-h-max rounded-md">
      <div className="flex items-center">
        <img
          src={logo ? logo : getPrefixImageUrl(name)}
          alt={name}
          className="h-16 w-16 object-contain mb-2 rounded-md"
        />
      </div>
      <div className="flex items-center">
        <p className="text-xl font-semibold text-gray-600">{name + " "}</p>
        <p className="text-lg text-gray-600"> ({rating})</p>
      </div>

      <p className="text-wrap my-2">{description}</p>
    </div>
  );
};

export default CompanyCard;
