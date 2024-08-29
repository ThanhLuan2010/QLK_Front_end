import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  if (!localStorage.getItem("token"))
    return (
      <Navigate
        to={{
          pathname: "/login",
        }}
      ></Navigate>
    );
  return <Outlet />;
};
export default PrivateRoute;

export const PublicRoute = () => {
  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};
