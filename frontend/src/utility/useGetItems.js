import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_URL } from "./constants";

//it is a custom hook made for the purpose of code reusability
const useGetItems = (path, params, dependencies, defaultValue = []) => {
  const [items, setItems] = useState(defaultValue);
  const getItems = async () => {
    try {
      const result = await axios({
        method: "get",
        url: SERVER_URL + path,
        withCredentials: true,
        params: params,
      });

      setItems(result?.data?.data);
      return true;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    getItems();
  }, dependencies);

  return [items, setItems];
};

export default useGetItems;
