import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../utility/constants";

const Company = () => {
  const getAllCompanies = async () => {
    try {
      const result = await axios({
        method: "get",
        url: SERVER_URL + "/company/view/676294af0e51ad7eec364d65",
      });
      setCompany(result.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const [company, setCompany] = useState(null);
  useEffect(() => {
    getAllCompanies();
  }, []);

  return company ? (
    <div>
      <ul>
        <li>{company?.name}</li>
        <li>{company?.website}</li>
        <li>{company?.rating}</li>
      </ul>
    </div>
  ) : null;
};

export default Company;
