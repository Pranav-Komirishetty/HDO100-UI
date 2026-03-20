import { useNavigate } from "react-router-dom";
import { isTokenValid } from "../utils/auth";

export function useAuth() {
  const navigate = useNavigate();

  const login = (token: string) => {
    localStorage.setItem("token", token);
    navigate("/dashboard", { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return isTokenValid(token);
  };

  return {
    login,
    logout,
    isAuthenticated,
  };
}
