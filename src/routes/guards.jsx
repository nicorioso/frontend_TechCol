import { Navigate } from "react-router-dom";
import { getCurrentRole, getToken } from "../utils/authSession";

const isAdminRole = () => getCurrentRole().includes("ADMIN");

export function RequireAuth({ children }) {
  if (!getToken()) return <Navigate to="/auth/login" replace />;
  return children;
}

export function RequireAdmin({ children }) {
  if (!isAdminRole()) return <Navigate to="/user/profile" replace />;
  return children;
}

export function RequireUser({ children }) {
  if (isAdminRole()) return <Navigate to="/admin/profile" replace />;
  return children;
}
