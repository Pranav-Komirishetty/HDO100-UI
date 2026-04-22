import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendSignupOtp } from "../api/authApi";
import backIcon from "../assets/back.svg";

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await sendSignupOtp(name, email);

      navigate("/verify-signup", {
        state: { name, email },
      });
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
          onClick={() => navigate("/login")}
          className="text-sm text-indigo-600 mb-6"
        >
          <img src={backIcon} alt="back" className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border  border-gray-300 bg-neutral-400/60 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border  border-gray-300 bg-neutral-400/60 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl border border-gray-300 bg-indigo-600/40 shadow-inner text-white font-medium hover:bg-gray-100/40 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
