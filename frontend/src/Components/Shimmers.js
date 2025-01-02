export const JobCardShimmer = () => {
  return (
    <div className="py-4 px-5  mx-3 mb-2 w-full rounded-md shadow-md bg-white *:animate-pulse">
      <div className="flex">
        <div className="h-16 w-20 rounded-md mr-6 bg-gray-100"></div>

        <div className=" w-full">
          <div className="flex items-center mb-1">
            <p className="w-full h-7 bg-gray-100 mb-2"></p>
          </div>
          <p className="mb-2 bg-gray-100 w-full h-9 my-1"></p>
          <p className="first:*:ml-0 flex *:mx-1 flex-wrap"></p>
          <p className="w-full h-7 bg-gray-100"></p>

          <p className="w-full h-5 bg-gray-100 my-2"></p>
          <p className="w-full h-5 bg-gray-100 my-2"></p>
          <p className="w-full h-5 bg-gray-100 my-2"></p>

          <div className="flex items-center *:mr-4 mt-3 ">
            <button className="bg-gray-100 text-white px-4 py-2 rounded-sm w-32 h-10 "></button>
            <button className="bg-gray-100 text-white px-4 py-2 rounded-sm w-32 h-10"></button>
          </div>
        </div>
      </div>
    </div>
  );
};
