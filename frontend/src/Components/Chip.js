import React from "react";

const Chip = ({ value }) => {
  return (
    <div className="text-sm my-1 rounded-md px-3 py-1 capitalize text-white bg-gray-500 bg-opacity-80 tracking-wider">
      {value}
    </div>
  );
};

export default Chip;
