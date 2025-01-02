import React, { useContext, useEffect, useState } from "react";
import LOGIN_IMAGE from "../assets/AUTHENTICATION_FORM_ICON.svg";

import { PiEnvelopeSimpleLight } from "react-icons/pi";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import { CiLock } from "react-icons/ci";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ToastComponent from "./ToastComponent";
import axios from "axios";
import { SERVER_URL } from "../utility/constants";
import AuthContext from "../utility/authContext";

const Login = () => {
  const [isPasswordVisible, setIsPasswordvisible] = useState(false);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next");

  useEffect(() => {
    if (currentUser) {
      if (next) navigate(next);
      else navigate("/");
    }
  }, [currentUser]);

  const togglePasswordVisibility = () => {
    setIsPasswordvisible(!isPasswordVisible);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const response = await axios({
        method: "post",
        url: SERVER_URL + "/user/auth/login",
        withCredentials: true,
        data: {
          email: formData.get("email"),
          password: formData.get("password"),
        },
      });
      console.log(response);
      setCurrentUser(response?.data?.data);
      toast.success(<ToastComponent />, {
        data: {
          message: `Login success!!`,
          route: true,
          to: "/",
          where: "go to Home Page",
        },
      });
    } catch (err) {
      toast.error(<ToastComponent />, {
        data: { message: "Invalid email or password", route: false },
      });
      console.log(err);
    }
  };
  return (
    <>
      <div className="flex border-2 border-gray-600 rounded-lg absolute top-1/4 left-1/4">
        <div className="h-96 bg-gray-600 w-80">
          <img src={LOGIN_IMAGE} className="h-fit" />
          <p className="text-white text-2xl text-center mt-0">Welcome Back!</p>
        </div>
        <div className="h-96 w-80 max-h-max my-auto">
          <h1 className="text-3xl text-center p-2 font-mono mb-5 text-gray-600">
            Login
          </h1>
          <form className="text-center max-w-max m-auto" onSubmit={handleLogin}>
            <div className="border-[1px] border-gray-400 px-2 py-1 flex">
              <PiEnvelopeSimpleLight className="text-3xl text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                className="outline-none pl-2"
                name="email"
                required
              />
            </div>
            <div className="border-[1px] max-w-max px-2 py-1 flex border-gray-400 w-max">
              <CiLock className="text-3xl text-gray-400" />
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Password"
                className="outline-none pl-2"
                name="password"
                required
              />
              {isPasswordVisible ? (
                <BiHide
                  className="text-3xl text-gray-400 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <BiShow
                  className="text-3xl text-gray-100 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
            <Link to="/resetPassword">
              <p className="text-gray-600 text-right my-2 text-sm cursor-pointer">
                Forgot password?
              </p>
            </Link>
            <input
              type="submit"
              value="Login"
              className="text-white bg-gray-600 w-full py-2 rounded-md mt-3 cursor-pointer"
            />
            <p className="text-gray-600 text-right my-2 text-sm  m-auto max-w-max">
              Don't have an account?{" "}
              <Link to="/register">
                <span className="font-semibold cursor-pointer">Register</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
