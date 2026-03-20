import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isTokenValid } from "../utils/auth";

export default function AuthLanding() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isTokenValid(token)) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-custom-400/90 relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[url('/bg-texture.png')] opacity-20 pointer-events-none"></div>
      <div
        className="w-full max-w-sm relative z-10 bg-white/10 backdrop-blur-sm
shadow-[inset_0_0_20px_rgba(255,255,255,0.15)] border border-white/90 rounded-2xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white">Welcome</h1>
          <p className="text-sm text-white mt-2">
            Sign in or create an account
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/signin")}
            className="w-full py-3 rounded-xl border border-gray-300 bg-indigo-600/40 shadow-inner text-white font-medium hover:bg-gray-100/40 transition"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="w-full py-3 rounded-xl border border-gray-300 text-white font-medium hover:bg-gray-100/40 transition"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
