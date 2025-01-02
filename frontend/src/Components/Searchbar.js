import React, { useContext, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import AuthContext from "../utility/authContext";

const SearchSuggestions = ({
  areSuggestionsVisible,
  setSearchText,
  setAreSuggestionsVisible,
}) => {
  const { currentUser } = useContext(AuthContext);
  const suggestions = currentUser?.searchHistory || []; // suggestions stored in user search history (we have not used state variable for this because is it not that important here)

  return suggestions.length > 0 && areSuggestionsVisible ? (
    <div className="w-full bg-white rounded-md pt-1 pb-4 h-max absolute top-10 left-[-52px] shadow-xl z-50">
      <ul>
        {suggestions.map((suggestion) => (
          <li
            key={suggestion}
            className="hover:text-gray-600 hover:bg-gray-50 hover:font-semibold text-gray-500 cursor-pointer py-1 pl-12 pr-5 capitalize"
            //as the user hovers over a suggestion it comes in search box
            onMouseOver={() => {
              setSearchText(suggestion);
            }}
            //disable suggestion when clicked on a suggestion
            onClick={() => {
              setAreSuggestionsVisible(false);
            }}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

const Searchbar = ({ searchText, setSearchText, getResults }) => {
  //to decide whether to show suggestions or not under search bar (currently it shows only top 10 recent suggestions from what user searched in past when searchbar is focused and search text is empty)
  const [areSuggestionsVisible, setAreSuggestionsVisible] = useState(false);
  return (
    <form onSubmit={getResults} className=" mb-10">
      <div className="flex">
        <div className="flex border-gray-200 border-l-2 border-y-2 px-4 py-2 ml-10 rounded-l-md w-1/2 items-center has-[:focus]:border-blue-400">
          <IoSearchOutline className="text-2xl mr-3 text-gray-400" />
          <div className="w-full relative">
            <input
              type="text"
              className=" text-lg  outline-none text-gray-600 w-full"
              placeholder="Enter Role / Skill / Location / Company"
              value={searchText}
              maxLength={60}
              onChange={(e) => {
                setSearchText(e.target.value);
                if (e.target.value == "") setAreSuggestionsVisible(true);
                else setAreSuggestionsVisible(false);
              }}
              onFocus={() => {
                if (searchText == "") setAreSuggestionsVisible(true);
              }}
              onBlur={() => {
                if (searchText == "") setAreSuggestionsVisible(false);
              }}
            />
            <SearchSuggestions
              areSuggestionsVisible={areSuggestionsVisible}
              setSearchText={setSearchText}
              setAreSuggestionsVisible={setAreSuggestionsVisible}
            />
          </div>
        </div>
        {/* when this button is clicked, this form is submitted and submit event
        will be invoked which will enventually invoke getResults function */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-400"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default Searchbar;
