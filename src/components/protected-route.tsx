import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
