import { Link, useLocation } from "react-router-dom";
import HIRELIUM_LOGO from "../assets/HIRELIUM_LOGO_LESS_CROP.png";
import HIRELIUM_TEXT from "../assets/HIRELIUM_STYLISH_TEXT.png";
import { useContext } from "react";
import AuthContext from "../utility/authContext";
import ToastComponent from "./ToastComponent";
import { toast } from "react-toastify";
import axios from "axios";
import {
  IMAGE_WITH_INITIALS_URL_PREFIX,
  SERVER_URL,
} from "../utility/constants";
import { getPrefixImageUrl } from "../utility/helper";

const Header = () => {
  //getting loggedIn user info from AuthContext using useContext() hook
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  //getting current location using useLocation() hook provided by react-router-dom
  //location is passed as a search param (next) to Login page so that after successful login, user will be bought back to the page from which user hit login
  const location = useLocation();

  //arrow function to LogOut the user on click of logout buttton
  const logoutUser = async () => {
    try {
      await axios({
        method: "post",
        url: SERVER_URL + "/user/auth/logout",
        withCredentials: true, //this is used to enable modification of cookie items (if not used then token will not be deleted from cookies on logout)
      });

      //if loggedOut is success then setting currentUser to null
      setCurrentUser(null);

      //displaying toast
      toast.success(<ToastComponent />, {
        position: "top-center",
        data: {
          message: `Logout success!!`,
          route: false,
        },
      });
    } catch (err) {}
  };

  return (
    <>
      <div className="flex justify-between p-2 shadow-sm w-full sticky top-0 z-40 bg-white">
        <ul className="flex justify-between items-center *:px-3 *:font-semibold">
          <li className="flex items-center *:px-1">
            <img src={HIRELIUM_LOGO} alt="logo" className="h-10 rounded-md" />
            <img
              src={HIRELIUM_TEXT}
              alt="Hirelium"
              className="h-8 hidden md:block"
            />
          </li>

          {/* {using Link and to instead of a and href as anchor tag will reload the entire webpage again} */}
          <Link to="/">
            <li className="hover:text-black text-gray-600">Home</li>
          </Link>
          <Link to="/jobs">
            <li className="hover:text-black text-gray-600">Jobs</li>
          </Link>
          <Link to="/company">
            <li className="hover:text-black text-gray-600">Companies</li>
          </Link>

          {/* {showing profile tab only if user is logged in} */}
          {currentUser ? (
            <Link to="/profile">
              <li className="hover:text-black text-gray-600">Profile</li>
            </Link>
          ) : null}
        </ul>
        <ul className="flex justify-between items-center  *:pl-3 *:font-semibold pr-5">
          <li>
            {currentUser ? (
              <img
                src={
                  currentUser?.profilePicture
                    ? currentUser.profilePicture
                    : getPrefixImageUrl(currentUser.firstName)
                }
                className="h-10 rounded-full object-cover w-10 mx-2"
              />
            ) : (
              <div className="text-red-500 bg-red-100 px-3 rounded-lg py-2">
                Guest
              </div>
            )}
          </li>
          {/* {showing only logout if user is logged in and login and register is user is not logged in} */}
          {currentUser ? (
            <li
              className="bg-blue-500 text-white px-3 py-2 rounded-sm cursor-pointer hover:bg-blue-400"
              onClick={logoutUser}
            >
              Log Out
            </li>
          ) : (
            <>
              {/* {passing current path and search params to Login page in next(a search param)} */}
              <Link to={"/login?next=" + location.pathname + location.search}>
                <li className=" text-blue-500 border-blue-500 px-3 border-[1.5px] py-2 rounded-sm cursor-pointer hover:text-blue-400 hover:border-blue-400">
                  Log In
                </li>
              </Link>
              <Link to="/register">
                <li className="bg-blue-500 text-white px-3 py-2 rounded-sm hidden sm:block hover:bg-blue-400">
                  Register
                </li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Header;
