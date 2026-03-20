import { Navigate } from "react-router-dom";
import { isTokenValid } from "../utils/auth";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem("token");

  if (!isTokenValid(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
