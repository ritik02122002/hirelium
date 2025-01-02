import React, { useState } from "react";
import LOGIN_IMAGE from "../assets/AUTHENTICATION_FORM_ICON.svg";

import { PiEnvelopeSimpleLight } from "react-icons/pi";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import { CiLock } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BsPerson } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import axios from "axios";
import { SERVER_URL } from "../utility/constants";
import { toast } from "react-toastify";
import ToastComponent from "./ToastComponent";

const Register = () => {
  const [isPasswordVisible, setIsPasswordvisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordvisible(!isPasswordVisible);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let data = {};
    const formData = new FormData(e.target);
    formData.forEach((value, key) => {
      data[key] = value;
    });
    try {
      const response = await axios({
        method: "post",
        url: SERVER_URL + "/user/auth/register",
        withCredentials: true,
        data,
      });
      console.log(response);
      toast.success(<ToastComponent />, {
        data: {
          message: `Registration success!! Welcome ${data.firstName}`,
          success: true,
        },
      });
    } catch (err) {
      toast.error(<ToastComponent />, {
        data: {
          message: "Oops!! Registration failed",
          success: false,
          to: "/login",
          where: "login",
        },
      });
      console.log(err);
    }
  };

  return (
    <>
      <h1>
        {" "}
        <h1>
          At Hirelium, it’s more than just finding a job—it’s about discovering
          opportunities that match your passion and unlocking your potential.
        </h1>
      </h1>
      <div className="flex border-2 border-gray-600 rounded-lg absolute top-1/4 left-1/4">
        <div className="h-96 bg-gray-600 w-80">
          <img src={LOGIN_IMAGE} className="h-fit" />
          <p className="text-white text-2xl text-center mt-0">
            Welcome to Hirelium
          </p>
        </div>
        <div className="h-96 w-80 max-h-max my-auto">
          <h1 className="text-3xl text-center p-2 font-mono mb-5 text-gray-600">
            Register
          </h1>
          <form
            className="text-center max-w-max m-auto"
            onSubmit={handleRegister}
          >
            <div className="border-[1px] border-gray-400 px-2 py-1 flex">
              <CiUser className="text-3xl text-gray-400" />
              <span className="text-red-500  ml-1">*</span>
              <input
                type="text"
                placeholder="First Name"
                className="outline-none pl-2"
                name="firstName"
                required
              />
            </div>
            <div className="border-[1px] border-gray-400 px-2 py-1 flex">
              <PiEnvelopeSimpleLight className="text-3xl text-gray-400" />
              <span className="text-red-500 ml-1">*</span>
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
              <span className="text-red-500  ml-1">*</span>
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
                  className="text-3xl text-gray-400 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
            {/* <p className="text-gray-600 text-right my-2 text-sm cursor-pointer">
            Forgot password?
          </p> */}
            <div className="border-[1px] px-2 py-1 flex border-gray-400 w-full">
              <BsPerson className="text-3xl text-gray-400" />
              <span className="text-red-500  ml-1">*</span>
              <select
                className="outline-none pl-2 text-gray-400 w-full"
                name="role"
                required
              >
                <option value="">Register As</option>
                <option className="text-gray-600" value="JobSeeker">
                  Job Seeker
                </option>
                <option className="text-gray-600" value="Recruiter">
                  Recruiter
                </option>
              </select>
            </div>
            <input
              type="submit"
              value="Register"
              className="text-white bg-gray-600 w-full py-2 rounded-md mt-3 cursor-pointer"
            />
            <p className="text-gray-600 text-right my-2 text-sm  m-auto max-w-max">
              Already have an account?{" "}
              <Link to="/login">
                <span className="font-semibold cursor-pointer">Login</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
