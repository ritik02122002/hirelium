import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_URL } from "./constants";

const usePostItems = (path, data, dependencies) => {
  const getItems = async () => {
    try {
      const result = await axios({
        method: "post",
        url: SERVER_URL + path,
        withCredentials: true,
        data: data,
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  return [items, setItems];
};

export default usePostItems;
