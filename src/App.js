import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { routes } from "./route/route";
import PrivateRoute, { PublicRoute } from "./route/PrivateRoute";
import API from "./api/APIInterceptor";
// API.interceptor();
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

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
