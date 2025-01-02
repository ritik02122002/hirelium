import Application from "./Components/Application";
import Home from "./Components/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ResetPassword from "./Components/ResetPassword";
import AuthContext from "./utility/authContext";
import JobsList from "./Components/JobsList";
import JobDetails from "./Components/JobDetails";
import CompaniesList from "./Components/CompaniesList";
import Profile from "./Components/Profile";
import useGetItems from "./utility/useGetItems";

function App() {
  // currentUser is used to store info regarding loggedIn user. if user is not logged in it is null
  //it is included in Auth Context and provided to entire Application so that we can use it wherever we want using useContext() hook
  const [currentUser, setCurrentUser] = useGetItems(
    "/user/profile/view",
    null,
    [],
    null
  );
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {/* {providing routes to the entire application} */}
      <RouterProvider router={appRouter} />
    </AuthContext.Provider>
  );
}

//creating routes for our app using createBrowserRouter
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Application />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: null,
      },
      {
        path: "company",
        element: <CompaniesList />,
      },
      {
        path: "jobs",
        element: <JobsList />,
      },
      {
        path: "job/details",
        element: <JobDetails />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/resetPassword",
    element: <ResetPassword />,
  },
]);

export default App;
