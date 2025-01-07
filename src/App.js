import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute, { PublicRoute } from "./route/PrivateRoute";
import { routes } from "./route/route";
// API.interceptor();
function App() {
  return (
    <Routes>
      {routes.map((route, index) => {
        if (route.public) {
          return (
            <Route key={"route-" + index} element={<PublicRoute />}>
              <Route path={route.path} element={route.element} />
            </Route>
          );
        } else {
          return (
            <Route key={"route-" + index} element={<PrivateRoute />}>
              <Route path={route.path} element={route.element} />
            </Route>
          );
        }
      })}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
