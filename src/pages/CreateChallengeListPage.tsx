import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDraftChallenges } from "../services/challengeService";
import { useToast } from "../components/ToastContext";
import { useAuth } from "../hooks/useAuth";
import backIcon from "../assets/back.svg";
import editIcon from "../assets/write.svg";
import { useLoader } from "../components/LoaderContext";

export default function CreateChallengeListPage() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const { showLoader, hideLoader } = useLoader();

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { logout } = useAuth();

  useEffect(() => {
    async function fetchDrafts() {
      try {
        showLoader(localStorage.getItem("currentDay"));
        const data = await getDraftChallenges();
        setDrafts(data.challenges || []);
      } catch (err: any) {
        if (err.status === 401) {
          showToast("Session expired. Please login again.", "error");
          logout();
        } else {
          showToast("Failed to load drafts","error");
        }
      } finally {
        hideLoader();
      }
    }

    fetchDrafts();
  }, []);

  return (
    <div className="p-4 space-y-4 pb-28">
      <div className="flex items-center mb-4 text-custom-400">
        <button onClick={() => navigate("/dashboard")} className="mr-3">
          <img src={backIcon} alt="back" className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold">Draft Challenges</h1>
      </div>

      {drafts.length === 0 ? (
        <button
          onClick={() => navigate("/create/new")}
          className="w-full py-4 mt-4 
            bg-gradient-to-b from-custom-400 to-custom-200
      text-white/70
      border-2
      border-b-0
      border-custom-300
      px-4
      rounded-l-full
      rounded-r-full
      hover:shadow-md
      transition"
        >
          + Create Challenge
        </button>
      ) : (
        <>
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="border-custom-300 border-l border-t bg-gradient-to-br from-custom-200 to-orange-300 rounded-xl p-4 flex justify-between items-center"
            >
              <div
                onClick={() => navigate(`/create/${draft.id}`)}
                className="cursor-pointer"
              >
                <p className="font-semibold text-custom-400">{draft.name}</p>
                <p className="text-sm text-neutral-700/90">
                  Created On: {new Date(draft.created_at).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => navigate(`/create/${draft.id}`)}
                className="text-gray-500"
              >
                <img src={editIcon} alt="back" className="h-5 w-5" />
              </button>
            </div>
          ))}

          <button
            onClick={() => navigate("/create/new")}
            className="w-full py-4 mt-4 
            bg-gradient-to-b from-custom-400 to-custom-200
      text-white/70
      border-2
      border-b-0
      border-custom-300
      px-4
      rounded-l-full
      rounded-r-full
      hover:shadow-md
      transition"
          >
            + Add Challenge
          </button>
        </>
      )}
    </div>
  );
}
