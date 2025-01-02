import React, { useEffect, useState } from "react";
import LOGIN_IMAGE from "../assets/AUTHENTICATION_FORM_ICON.svg";
import HIRELIUM_LOGO from "../assets/HIRELIUM_LOGO_MORE_CROP.png";
import HIRELIUM_TEXT from "../assets/HIRELIUM_STYLISH_TEXT.png";
import { PiEnvelopeSimpleLight } from "react-icons/pi";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import { CiLock } from "react-icons/ci";
import { toast } from "react-toastify";
import ToastComponent from "./ToastComponent";
import axios from "axios";
import { SERVER_URL } from "../utility/constants";
import validator from "validator";
import { PiClockCountdownLight } from "react-icons/pi";

const getTimeInFormat = (seconds) => {
  let min = String(parseInt(seconds / 60));
  let sec = String(seconds % 60);
  if (min.length == 1) min = "0" + min;
  if (sec.length == 1) sec = "0" + sec;
  return min + ":" + sec;
};
const ResetPassword = () => {
  const [isPasswordVisible, setIsPasswordvisible] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otpTimerSeconds, setOtpTimerSeconds] = useState(
    new Date(new Date(Date.now()))
  );

  const togglePasswordVisibility = () => {
    setIsPasswordvisible(!isPasswordVisible);
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    try {
      if (data.password != data.newPassword)
        throw new Error("passwords did not match");
      if (!validator.isStrongPassword(data.password))
        throw new Error(
          "Please enter a strong password (Minimum length 8 and should contain atleast one each of lowercase, uppercase, number & symbol)"
        );

      if (data.otp.length != 6) throw new Error("Please enter valid OTP");

      if (otpTimerSeconds == 0) throw new Error("OTP expired");
      const response = await axios({
        method: "patch",
        url: SERVER_URL + "/user/auth/password/update",
        withCredentials: true,
        data: {
          email: data.email,
          newPassword: data.password,
          otp: data.otp,
        },
      });
      console.log(response);
      toast.success(<ToastComponent />, {
        data: {
          message: `Password changed successfully!!`,
          route: true,
          to: "/login",
          where: "Login",
        },
      });
    } catch (err) {
      console.log(err);
      let message = err?.response?.data?.message || err.message;
      toast.error(<ToastComponent />, {
        data: { message, route: false },
      });
    }
  };
  const handleSendOTP = async (e) => {
    try {
      if (!validator.isEmail(email)) {
        throw new Error("Please enter a valid email");
      }
      const response = await axios({
        method: "post",
        url: SERVER_URL + "/user/auth/otp",
        withCredentials: true,
        data: {
          email,
        },
      });
      console.log(response);
      setIsOtpSent(true);
      setOtpTimerSeconds(new Date(Date.now()) + 600000); //5 minutes
      toast.success(<ToastComponent />, {
        data: {
          message: `OTP sent successfully!!`,
          route: false,
        },
      });
    } catch (err) {
      console.log(err);
      let message = err?.response?.data?.message || err.message;
      toast.error(<ToastComponent />, {
        data: { message, route: false },
      });
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (Math.floor((otpTimerSeconds - new Date(Date.now())) / 1000) <= 0) {
        clearTimeout(timeout);
      } else {
        setOtpTimerSeconds(new Date(Date.now()));
      }
    }, 1000);

    return () => {
      console.log("hello");
      clearTimeout(timeout);
    };
  }, [otpTimerSeconds]);
  return (
    <>
      <div className="flex max-w-max m-auto mt-12 items-center">
        <img src={HIRELIUM_TEXT} className="lg:h-16 h-10 md:h-12" />
        {/* <h1 className="text-center text-4xl">Hirelium</h1> */}
      </div>
      <div className="flex max-w-max m-auto items-center my-2 lg:*:text-3xl md:*:text-2xl sm:*:text-xl">
        <p className="text-center">Powered by </p>
        <img src={HIRELIUM_LOGO} className="h-5 ml-2 md:h-7 lg:h-9" />
        <p className="text-center">elium, Driven by Opportunities</p>
      </div>
      <div className="flex border-2 border-gray-600 rounded-lg max-w-max m-auto mt-10">
        <div className="h-96 bg-gray-600 w-80 md:block hidden">
          <img src={LOGIN_IMAGE} className="h-fit" />
          <p className="text-white text-2xl text-center mt-0">Welcome Back!</p>
        </div>
        <div className="h-96 w-80 max-h-max my-auto">
          <h1 className="text-3xl text-center p-2 font-mono mb-2 text-gray-600">
            Reset Password
          </h1>
          <form
            className="text-center max-w-max m-auto"
            onSubmit={handleResetPassword}
          >
            <div className="border-[1px] border-gray-400 px-2 py-1 flex">
              <PiEnvelopeSimpleLight className="text-3xl text-gray-400" />

              <input
                type="email"
                placeholder="Registered Email"
                className="outline-none pl-2 disabled:text-gray-300"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                {...(isOtpSent && { disabled: true })}
              />
            </div>
            <button
              type="button"
              className="text-white bg-gray-600 w-full py-2 rounded-md my-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={handleSendOTP}
              {...(otpTimerSeconds > new Date() && { disabled: true })}
            >
              {isOtpSent ? "Resend OTP" : "Get OTP"}
            </button>
            {isOtpSent && (
              <>
                <div className="border-[1px] px-2 py-1  border-gray-400 w-full flex">
                  <CiLock className="text-3xl text-gray-400" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="outline-none pl-2"
                    name="password"
                    required
                  />
                </div>

                <div className="border-[1px] max-w-max px-2 py-1 border-gray-400 w-max flex">
                  <CiLock className="text-3xl text-gray-400" />
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="outline-none pl-2"
                    name="newPassword"
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

                <div className="border-[1px] px-2 py-1  border-gray-400 w-full flex">
                  <PiClockCountdownLight className="text-3xl text-gray-400" />
                  <input
                    type="password"
                    placeholder="OTP"
                    className="outline-none pl-2"
                    name="otp"
                    required
                  />
                </div>

                {otpTimerSeconds == 0 ? (
                  <p className="text-gray-600 text-right my-2 text-sm  m-auto max-w-max">
                    OTP expired
                  </p>
                ) : (
                  <p className="text-gray-600 text-right my-2 text-sm  m-auto max-w-max">
                    OTP will expire in :
                    <span className="font-semibold cursor-pointer">
                      {" "}
                      {Math.floor(
                        (otpTimerSeconds - new Date(Date.now())) / 1000
                      )}{" "}
                    </span>
                    minutes
                  </p>
                )}

                <input
                  type="submit"
                  value="Reset Password"
                  className="text-white bg-gray-600 w-full py-2 rounded-md mt-3 cursor-pointer"
                />
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
