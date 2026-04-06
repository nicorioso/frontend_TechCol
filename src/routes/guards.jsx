import { Navigate } from "react-router-dom";
import { getToken, isAdminRole } from "../utils/authSession";

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
