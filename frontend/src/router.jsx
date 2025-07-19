import { useRoutes, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import FileTable from "./components/FileTable";
import AdminUsers from "./components/AdminUsers";
import { useSelector } from "react-redux";

export default function Router() {
  const user = useSelector(state => state.user);


  return useRoutes([
    { path: "/login", element: <LoginForm /> },
    { path: "/register", element: <RegisterForm /> },
    {
      path: "/",
      element: user ? <FileTable /> : <Navigate to="/login" replace />,
    },
    {
      path: "/admin",
      element:
        user?.is_admin ? <AdminUsers /> : <Navigate to="/" replace />,
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ]);
}
