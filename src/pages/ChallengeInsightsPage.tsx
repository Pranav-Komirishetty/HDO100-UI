import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChallengeAnalytics } from "../services/challengeService";
import { useToast } from "../components/ToastContext";
import { useAuth } from "../hooks/useAuth";
import backIcon from "../assets/back.svg";
import ColorGuide from "../components/ColorGuide";
import { useLoader } from "../components/LoaderContext";

export default function ChallengeInsightsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [data, setData] = useState<any>(null);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    async function load() {
      try {
        showLoader(localStorage.getItem("currentDay"));
        const res = await getChallengeAnalytics(id!);
        setData(res);
      } catch (err: any) {
        if (err.status === 401) {
          showToast("Session expired. Please login again.", "error");
          logout();
        } else {
          showToast(err.message || "Failed to load insights", "error");
          navigate(`/challenge/${id}`);
        }
      } finally {
        hideLoader();
      }
    }

    load();
  }, [id]);

  async function handleGoToCompletedDay(
    date: string,
    isCurrentDay: boolean,
    requestedDay: number,
  ) {
    try {
      if (data.current_day == 0) {
        showToast(`Your challenge will start on next day`, "info");
        return;
      }
      if (isCurrentDay == true) {
        navigate(`/my-challenges/challenge/${data.challenge.id}/today`);
      } else if (
        !isCurrentDay &&
        (requestedDay < 1 || requestedDay > data.current_day)
      ) {
        showToast(`No data found for the requested day`, "info");
        return;
      } else {
        navigate(`/my-challenges/challenge/${data.challenge.id}/day/${date}`);
      }
    } catch {
      showToast("Failed to start challenge", "error");
    }
  }

  if (!data) return null;

  const { streaks, grid } = data;

  return (
    <div>
      <button onClick={() => navigate(`/challenge/${id}`)} className="mb-4">
        <img src={backIcon} alt="back" className="h-5 w-5" />
      </button>

      <h1 className="text-lg font-bold mb-4 text-custom-400">
        {data.challenge.name} Insights
      </h1>

      {/* STREAK CARDS */}
      <div className="grid grid-cols-2 gap-4 text-custom-400">
        <StatCard
          label="Current Activity Streak"
          value={streaks.currentLoginStreak}
        />
        <StatCard
          label="Best Activity Streak"
          value={streaks.highestLoginStreak}
        />
        <StatCard
          label="Current High Score Streak"
          value={streaks.current75Streak}
        />
        <StatCard
          label="Best High Score Streak"
          value={streaks.highest75Streak}
        />
      </div>

      {/* COMPLETION SUMMARY */}
      <div className="mt-6 bg-white p-4 rounded-xl shadow-sm text-custom-400">
        <p className="font-semibold mb-2">Challenge Summary</p>
        <p>High Scoring Days: {streaks.totalCompletedDays}</p>
        <p>Progressive Days: {streaks.userMarkedDays}</p>
        <p>Missed Days: {streaks.systemMarkedDays}</p>
      </div>

      {/* GRID */}
      <div className="mt-6">
        <div className="grid grid-cols-10 gap-1">
          {grid.cells.map((cell: any, index: number) => (
            <div
              key={index}
              className={`h-6 w-6 rounded-md ${
                cell.total_score == 0 && !cell.is_future
                  ? "bg-black/60 text-white/70 font-semibold"
                  : cell.total_score == -1 && cell.is_future
                    ? "bg-gray-400/60 text-white/70 font-semibold"
                    : cell.total_score > 0 && cell.total_score < 21
                      ? "bg-red-400 text-black/60 font-semibold"
                      : cell.total_score > 20 && cell.total_score < 41
                        ? "bg-red-300 text-black/60 font-semibold"
                        : cell.total_score > 40 && cell.total_score < 61
                          ? "bg-lime-200 text-black/60 font-semibold"
                          : cell.total_score > 60 && cell.total_score < 81
                            ? "bg-lime-300 text-black/60 font-semibold"
                            : cell.total_score > 80 && cell.total_score < 91
                              ? "bg-lime-400 text-black/60 font-semibold"
                              : cell.total_score > 90
                                ? "bg-lime-500 text-black/60 font-semibold"
                                : ""
              } ${
                cell.is_today
                  ? "outline-dashed outline-zinc-900/80 outline-2 shadow-sm shadow-black"
                  : ""
              }`}
              onClick={() => {
                handleGoToCompletedDay(
                  cell.date,
                  cell.is_today,
                  cell.day_number,
                );
              }}
            />
          ))}
        </div>

        {/* LEGEND */}
        <ColorGuide />
      </div>
    </div>
  );
}

function StatCard({ label, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}
