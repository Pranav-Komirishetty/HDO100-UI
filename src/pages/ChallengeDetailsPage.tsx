import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getChallengeDetails,
  setAsDefaultChallenge,
  startChallenge,
} from "../services/challengeService";
import ConfirmationModal from "../components/ConfirmationModal";
import { useToast } from "../components/ToastContext";
import { useAuth } from "../hooks/useAuth";
import backIcon from "../assets/back.svg";
import { useLoader } from "../components/LoaderContext";

interface Task {
  id: string;
  task_name: string;
  points: number;
  performance_percentage?: number;
}

export default function ChallengeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [challenge, setChallenge] = useState<any>(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showDefaultModal, setShowDefaultModal] = useState(false);
  const { showToast } = useToast();
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    async function fetchDetails() {
      try {
        showLoader(localStorage.getItem("currentDay"));
        const data = await getChallengeDetails(id!);
        setChallenge(data);
      } catch (err: any) {
        if (err.status === 401) {
          showToast("Session expired. Please login again.", "error");
          logout();
        } else {
          showToast("Failed to load challenge details", "error");
          navigate("/my-challenges");
        }
      } finally {
        hideLoader();
      }
    }

    fetchDetails();
  }, [id]);

  if (!challenge) return <p>Challenge not found</p>;

  const totalPoints = challenge.tasks.reduce(
    (sum: number, t: Task) => sum + t.points,
    0,
  );

  const canStart =
    challenge.status === "draft" &&
    challenge.tasks.length >= 3 &&
    totalPoints === 100;

  async function handleGoToToday() {
    try {
      if (challenge.current_day == 0) {
        showToast(
          `Your challenge will start on ${challenge.start_date}`,
          "info",
        );
        return;
      }
      navigate(`/my-challenges/challenge/${challenge.id}/today`);
    } catch {
      showToast("Failed to start challenge","error");
    }
  }

  async function handleViewInsights() {
    try {
      if (challenge.current_day == 0) {
        showToast(`You can view insights once challenge starts`, "info");
        return;
      }
      navigate(`/my-challenges/challenge/${challenge.id}/insights`);
    } catch {
      showToast("Failed to view insights","error");
    }
  }

  async function handleViewCalendar() {
    try {
      if (challenge.current_day == 0) {
        showToast(`You can view calendar once challenge starts`, "info");
        return;
      }
      navigate(`/my-challenges/challenge/${challenge.id}/calendar`);
    } catch {
      showToast("Failed to view insights", "error");
    }
  }

  async function handleStartChallege() {
    try {
      await startChallenge(challenge.id);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
      setTimeout(() => {
        showToast("your day 1 starts form tomorrow", "info");
      });
      return "success";
    } catch (err: any) {
      if (err.status === 401) {
        showToast("Session expired. Please login again.", "error");
        logout();
      } else if (err.message.length > 1) {
        showToast(err.message, "error");
        //setShowStartModal(false)
        setTimeout(() => {
          setShowStartModal(false);
        }, 1500);
        return "failed";
      } else {
        showToast("Delete failed", "error");
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <button onClick={() => navigate("/my-challenges")}>
          <img src={backIcon} alt="back" className="h-5 w-5" />
        </button>

        {challenge.status === "active" && (
          <button
            onClick={handleViewCalendar}
            className="text-sm px-3 py-1 bg-gradient-to-b from-custom-400 to-custom-200
      text-white/70
      border
      border-b-0
      border-custom-300
      rounded-2xl
      hover:shadow-md
      transition"
          >
            Calendar
          </button>
        )}
      </div>

      <h1 className="text-lg font-bold block text-custom-400 mb-2">
        {challenge.name}
      </h1>

      <p className="text-sm font-bold text-neutral-700 mb-4">
        Status: {challenge.status}
      </p>

      {challenge.status === "active" && (
        <div className="mb-4 space-x-2">
          <p className="font-semibold text-custom-400">
            Current Day: {challenge.current_day}
          </p>

          <button
            onClick={handleGoToToday}
            className="mt-2  px-2 flex-1 bg-gradient-to-br from-custom-400 to-custom-300
      text-white/70
      border-2
      border-b-0
      border-custom-300
      py-2
      rounded-2xl
      hover:shadow-md
      transition
      text-sm
      disabled:text-black 
      disabled:opacity-50"
          >
            Log Today
          </button>
          <button
            onClick={handleViewInsights}
            className="mt-2  px-2 flex-1 bg-gradient-to-br from-custom-400 to-custom-300
      text-white/70
      border-2
      border-b-0
      border-custom-300
      py-2
      rounded-2xl
      hover:shadow-md
      transition
      text-sm
      disabled:text-black 
      disabled:opacity-50"
          >
            Insights
          </button>
          {challenge.is_default === false && (
            <button
              onClick={() => setShowDefaultModal(true)}
              className="mt-2  px-2 flex-1 bg-gradient-to-br from-custom-400 to-custom-300
      text-white/70
      border-2
      border-b-0
      border-custom-300
      py-2
      rounded-2xl
      hover:shadow-md
      transition
      text-sm
      disabled:text-black 
      disabled:opacity-50"
            >
              Make Primary
            </button>
          )}
        </div>
      )}

      {challenge.status === "draft" && (
        <div className="mb-4 space-x-2">
          <button
            onClick={() => navigate(`/create/${challenge.id}`)}
            className="mt-2  px-4 flex-1 bg-gradient-to-br from-custom-400 to-custom-300
      text-white/70
      border-2
      border-b-0
      border-custom-300
      py-2
      rounded-2xl
      hover:shadow-md
      transition
      text-sm
      disabled:text-black 
      disabled:opacity-50"
          >
            Edit
          </button>

          {canStart && (
            <button
              onClick={() => setShowStartModal(true)}
              className="mt-2  px-2 flex-1 bg-gradient-to-br from-custom-400 to-custom-300
      text-white/70
      border-2
      border-b-0
      border-custom-300
      py-2
      rounded-2xl
      hover:shadow-md
      transition
      text-sm
      disabled:text-black 
      disabled:opacity-50"
            >
              Start Challenge
            </button>
          )}
        </div>
      )}

      <div className="mt-6">
        <h2 className="font-semibold mb-2 text-custom-400">Tasks</h2>

        <div className="space-y-3 mb-5">
          {challenge.tasks.map((task: Task) => (
            <div
              key={task.id}
              className="p-3 rounded-xl shadow-lg cursor-pointer transition hover:shadow-md
            border-custom-300 border-l border-t bg-gradient-to-br from-custom-200 to-orange-300"
            >
              <div className="flex justify-between">
                <p className="font-semibold text-custom-400">
                  {task.task_name}
                </p>
                <p className="text-sm text-neutral-700/80">{task.points} pts</p>
              </div>

              {challenge.status === "active" && (
                <div className="mt-2">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full ${
                        task?.performance_percentage != undefined &&
                        (task?.performance_percentage > 0 &&
                        task?.performance_percentage < 21
                          ? "bg-red-400 text-black/60 font-semibold"
                          : task?.performance_percentage > 20 &&
                              task?.performance_percentage < 41
                            ? "bg-red-300 text-black/60 font-semibold"
                            : task?.performance_percentage > 40 &&
                                task?.performance_percentage < 61
                              ? "bg-lime-200 text-black/60 font-semibold"
                              : task?.performance_percentage > 60 &&
                                  task?.performance_percentage < 81
                                ? "bg-lime-300 text-black/60 font-semibold"
                                : task?.performance_percentage > 80 &&
                                    task?.performance_percentage < 91
                                  ? "bg-lime-400 text-black/60 font-semibold"
                                  : task?.performance_percentage > 90
                                    ? "bg-lime-500 text-black/60 font-semibold"
                                    : "")
                      }`}
                      style={{
                        width: `${task?.performance_percentage || 0}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-neutral-700/80 mt-1">
                    {task.performance_percentage || 0}% consistency
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <ConfirmationModal
        isOpen={showStartModal}
        title="Start Challenge?"
        message="Once started, tasks cannot be edited."
        confirmText="Start"
        variant="success"
        successMessage="Challenge started"
        failMessage="Failed to start challenge"
        onCancel={() => setShowStartModal(false)}
        onConfirm={handleStartChallege}
      />
      <ConfirmationModal
        isOpen={showDefaultModal}
        title="Set Challenge as Dashboard default?"
        message="You can see the insights for this challenge in Dashboard"
        confirmText="Set default"
        variant="success"
        successMessage="Primary challenge updated"
        failMessage="failed to update"
        onCancel={() => setShowDefaultModal(false)}
        onConfirm={async () => {
          await setAsDefaultChallenge(challenge.id);

          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        }}
      />
    </div>
  );
}
