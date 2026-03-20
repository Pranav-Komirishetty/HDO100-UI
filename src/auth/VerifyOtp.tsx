import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifySignupOtp } from "../api/authApi";
import { useToast } from "../components/ToastContext";
import backIcon from "../assets/back.svg";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const { name, email } = location.state || {};
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await verifySignupOtp(name, email, otp);

      showToast("Signup successful 🎉", "success");
      navigate("/signin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-custom-400/90 relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[url('/bg-texture.png')] opacity-20 pointer-events-none"></div>
      <div
        className="w-full max-w-sm relative z-10 bg-white/10 backdrop-blur-sm
shadow-[inset_0_0_20px_rgba(255,255,255,0.15)] border border-white/90 rounded-xl p-8"
      >
        <button
          onClick={() => navigate("/signup")}
          className="text-sm text-indigo-600 mb-6"
        >
          <img src={backIcon} alt="back" className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-semibold text-white mb-4 text-center">
          Verify OTP
        </h2>

        <p className="text-sm text-white mb-6 text-center">
          OTP sent to {email}
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border  border-gray-300 bg-neutral-400/60 text-white rounded-lg px-4 py-3 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl border border-gray-300 bg-indigo-600/40 shadow-inner text-white font-medium hover:bg-gray-100/40 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
