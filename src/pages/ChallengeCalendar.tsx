import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCalendar } from "../services/challengeService";
import { useToast } from "../components/ToastContext";
import { useAuth } from "../hooks/useAuth";
import backIcon from "../assets/back.svg";
import ColorGuide from "../components/ColorGuide";
import { useLoader } from "../components/LoaderContext";

export default function ChallengeCalendarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [months, setMonths] = useState<any[]>([]);
  const [currentDay, setCurrentDay] = useState(0);
  const [challengeName, setChallengeName] = useState("");
  const { logout } = useAuth();
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    async function load() {
      try {
        showLoader(localStorage.getItem("currentDay"));
        const data = await getCalendar(id!);
        setMonths(data.months);
        setCurrentDay(data.currentDay);
        setChallengeName(data.challengeName);
        setMonthOffset(data.months);
      } catch (err: any) {
        if (err.status === 401) {
          showToast("Session expired. Please login again.", "error");
          logout();
        } else {
          showToast("Failed to load calendar", "error");
          navigate(`/challenge/${id}`);
        }
      } finally {
        hideLoader();
      }
    }

    load();
  }, [id]);

  async function setMonthOffset(months: any) {
    months.forEach((month: any) => {
      const firstDay = new Date(month.days[0].date);
      let startOffset = firstDay.getDay();

      startOffset = startOffset === 0 ? 6 : startOffset - 1;
      month.startOffset = startOffset;
    });
  }

  async function handleGoToCompletedDay(
    date: string,
    isCurrentDay: boolean,
    requestedDay: number,
  ) {
    try {
      if (isCurrentDay == true) {
        navigate(`/my-challenges/challenge/${id}/today`);
      } else if (
        !isCurrentDay &&
        (requestedDay < 1 || requestedDay > currentDay)
      ) {
        showToast(`No data found for the requested day`, "info");
        return;
      } else {
        navigate(`/my-challenges/challenge/${id}/day/${date}`);
      }
    } catch {
      showToast("Failed to start challenge", "error");
    }
  }

  function getColor(day: any) {
    let cssClass =
      day.total_score == 0 && day.in_range && !day.is_future
        ? "bg-black/60 text-white/70 font-semibold"
        : day.total_score == 0 && (day.is_future || !day.in_range)
          ? "bg-gray-400/60 text-white/70 font-semibold"
          : day.total_score > 0 && day.total_score < 21
            ? "bg-red-400 text-black/60 font-semibold"
            : day.total_score > 20 && day.total_score < 41
              ? "bg-red-300 text-black/60 font-semibold"
              : day.total_score > 40 && day.total_score < 61
                ? "bg-lime-200 text-black/60 font-semibold"
                : day.total_score > 60 && day.total_score < 81
                  ? "bg-lime-300 text-black/60 font-semibold"
                  : day.total_score > 80 && day.total_score < 91
                    ? "bg-lime-400 text-black/60 font-semibold"
                    : day.total_score > 90
                      ? "bg-lime-500 text-black/60 font-semibold"
                      : "";
    return cssClass;
  }

  return (
    <div>
      <div className="flex-row">
        <button onClick={() => navigate(`/my-challenges/challenge/${id}`)}>
          <img src={backIcon} alt="back" className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold block text-custom-400 mb-2">
          {challengeName}
        </h1>
        <p className="text-md font-semibold text-neutral-700/80">
          Current day: {currentDay}
        </p>
      </div>
      <ColorGuide />

      {months.map((month) => (
        <div
          key={month.label}
          className="mb-8 mt-6 p-4 shadow-xl border rounded-2xl inset-shadow-sm
      border-custom-200 bg-gradient-to-b from-custom-200 to-custom-400"
        >
          <h2 className="text-lg font-semibold mb-3">{month.label}</h2>
          <div className="grid grid-cols-7 text-xs text-black/70 font-bold mb-2">
            {[
              { id: "monday", dL: "M" },
              { id: "tuesday", dL: "T" },
              { id: "wednesday", dL: "w" },
              { id: "thursday", dL: "t" },
              { id: "friday", dL: "F" },
              { id: "saturday", dL: "S" },
              { id: "sunday", dL: "S" },
            ].map((d) => (
              <div key={d.id} className="text-center">
                {d.dL}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm">
            {Array.from({ length: month.startOffset }).map((_, i) => (
              <div key={"empty-" + i} />
            ))}
            {month.days.map((day: any) => (
              <div
                key={day.date}
                className={`h-8 flex items-center justify-center rounded-md
                  ${getColor(day)}
                  ${day.is_today ? "outline-dashed outline-zinc-900/80 outline-2 shadow-md shadow-black" : ""}
                `}
                onClick={() => {
                  handleGoToCompletedDay(
                    day.date,
                    day.is_today,
                    day.day_number,
                  );
                }}
              >
                {new Date(day.date).getDate()}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
