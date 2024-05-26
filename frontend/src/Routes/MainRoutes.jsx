import { Routes, Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Home from "../Pages/Home";
import Admin from "../Pages/Admin";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";

export const MainRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoutes>
            <Home />
          </PrivateRoutes>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoutes>
            <Admin />
          </PrivateRoutes>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};
