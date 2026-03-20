import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllChallenges } from "../services/challengeService";
import { useToast } from "../components/ToastContext";
import { useAuth } from "../hooks/useAuth";
import backIcon from "../assets/back.svg";
import { useLoader } from "../components/LoaderContext";

interface Challenge {
  id: string;
  name: string;
  status: "draft" | "active" | "completed";
  is_default: boolean;
  created_at: string;
}

export default function MyChallengesPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { logout } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    async function fetchChallenges() {
      try {
        showLoader(localStorage.getItem("currentDay"));
        const data = await getAllChallenges();
        setChallenges(data.challenges);
      } catch (err: any) {
        if (err.status === 401) {
          showToast("Session expired. Please login again.", "error");
          logout();
        } else {
          showToast("Failed to load challenges", "error");
          navigate("/dashboard");
        }
      } finally {
        hideLoader();
      }
    }

    fetchChallenges();
  }, []);

  if (!challenges.length)
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500">No challenges created yet.</p>
      </div>
    );

  return (
    <div>
      <div className="flex items-center mb-4 text-custom-400">
        <button onClick={() => navigate("/dashboard")} className="mr-3">
          <img src={backIcon} alt="back" className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold">Your Challenges</h1>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            onClick={() => navigate(`/my-challenges/challenge/${challenge.id}`)}
            className="rounded-xl p-4 shadow-lg cursor-pointer transition hover:shadow-md
            border-custom-300 border-l border-t bg-gradient-to-br from-custom-200 to-orange-300"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{challenge.name}</p>
                <p className="text-sm text-gray-500">
                  Created On:{" "}
                  {new Date(challenge.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right place-self-end">
                {challenge.is_default && (
                  <span className="text-xs text-indigo-100 bg-gradient-to-br from-custom-400/80 to-indigo-700/80 shadow-2xl px-2 py-1 rounded-full mr-2">
                    primary
                  </span>
                )}

                <span
                  className={`text-xs px-2 py-1 rounded-full shadow-2xl ${
                    challenge.status === "active"
                      ? "text-green-100 bg-gradient-to-br from-custom-400/80 to-green-700/80"
                      : challenge.status === "draft"
                        ? "text-yellow-100 bg-gradient-to-br from-custom-400/80 to-yellow-600/80"
                        : " text-indigo-100 bg-gradient-to-br from-custom-400/80 to-indigo-700/80"
                  }`}
                >
                  {challenge.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
