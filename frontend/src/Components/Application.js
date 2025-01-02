import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Application = () => {
  return (
    //React.Fragment shorhand as all the elements must be wrapped in a single parent element
    <>
      {/* {including ToastContainer to enable toast for our application. If we don't include it then toast will not be shown} */}
      <ToastContainer />
      <Header />
      {/* {Outlet is provided by react-router-dom and is replaced by the appropriate child element of the element in which it is included(Here Application) as per path. As like here we want Header and Footer component to remain at their place and only replace the content between them as per path} */}
      <Outlet />
      <Footer />
    </>
  );
};

export default Application;
