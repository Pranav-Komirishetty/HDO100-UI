import { useEffect, useState } from "react";
import { getDashboard } from "./services/api";
import DashboardCalendar from "./components/DashboardCalendar";
import { useNavigate } from "react-router-dom";
import { useToast } from "./components/ToastContext";
import { useAuth } from "./hooks/useAuth";
import ColorGuide from "./components/ColorGuide";
import {useLoader} from "./components/LoaderContext"

interface GridItem {
  day_number: number;
  date: string;
  is_today: boolean;
  score: number;
  logged: boolean;
  is_future: boolean;
}

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [calendar, setCalendar] = useState<any>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const load = async () => {
      try {
        showLoader(localStorage.getItem('currentDay'));
        const res = await getDashboard();
        if(res.dashboard === null){
          setData(null);
          setCalendar(null);
          localStorage.setItem('currentDay', '0')
        } else {
          setData(res);
          setCalendar(res.calendar.months);
          localStorage.setItem('currentDay', res.current_day)
          localStorage.setItem('userName', res.user)
          localStorage.setItem('userAvatar', res.avatar)
        }
        hideLoader();
      } catch (err: any) {
        if (err.status === 401) {
          showToast("Session expired. Please login again.", "error");
          logout();
        }
      }
    };

    load();
  }, []);

  if (!data || !data.challenge) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center gap-2">
        <p>No active default challenge</p>

        <a href="/my-challenges" className="text-indigo-600 hover:underline">
          Select a primary challenge?
        </a>
      </div>
    );
  }

  async function handleGoToToday() {
    try {
      if (data.current_day == 0) {
        showToast(`Your challenge will start on next day`, "info");
        return;
      }
      navigate(`/my-challenges/challenge/${data.challenge.id}/today`);
    } catch {
      showToast("Failed to start challenge","error");
    }
  }

  async function handleCanlendarClick() {
    try {
      if (data.current_day == 0) {
        showToast(`Your challenge will start on next day`, "info");
        return;
      }
      navigate(`/my-challenges/challenge/${data.challenge.id}/calendar`);
    } catch {
      showToast("Failed to start challenge","error");
    }
  }

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
      showToast("Failed to start challenge","error");
    }
  }

  return (
    <>
      <div className="min-h-screen p-4 pb-0">
        {/* Header */}
        <div className="text-2xl font-bold text-neutral-600"> Hello! {data.user}</div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-cutom-400">
            {data.challenge.name}
          </h1>
          <p className="text-sm text-cutom-400">
            Day {data.current_day} / {data.total_days}
          </p>
        </div>

        {/* 21 Day Grid */}
        <div
          className="shadow-xl border rounded-xl pl-1 pr-1 inset-shadow-sm
      border-custom-200 bg-gradient-to-b from-custom-200 to-custom-400"
        >
          <div className="mb-4 mt-2 mx-2">
            <p className="text-lg font-semibold">
              Current Streak: {data.streak} {data.streak == 1 ? "day" : "days"}
            </p>
          </div>
          <div className="grid grid-cols-7 ">
            {data.grid_21_days.map((item: GridItem) => (
              <div
                key={item.date}
                onClick={() => {
                  handleGoToCompletedDay(
                    item.date,
                    item.is_today,
                    item.day_number,
                  );
                }}
                className={`
              aspect-square rounded-lg flex m-1 items-center justify-center text-xs p-1
              
              ${
                item.score == 0 && !item.is_future
                  ? "bg-black/60 text-white/70 font-semibold"
                  : item.score == 0 && item.is_future
                    ? "bg-gray-400/60 text-white/70 font-semibold"
                    : item.score > 0 && item.score < 21
                      ? "bg-red-400 text-black/60 font-semibold"
                      : item.score > 20 && item.score < 41
                        ? "bg-red-300 text-black/60 font-semibold"
                        : item.score > 40 && item.score < 61
                          ? "bg-lime-200 text-black/60 font-semibold"
                          : item.score > 60 && item.score < 81
                            ? "bg-lime-300 text-black/60 font-semibold"
                            : item.score > 80 && item.score < 91
                              ? "bg-lime-400 text-black/60 font-semibold"
                              : item.score > 90
                                ? "bg-lime-500 text-black/60 font-semibold"
                                : ""
              }
              ${
                item.is_today
                  ? "outline-dashed outline-zinc-900/80 outline-2 shadow-md shadow-black"
                  : ""
              }
             
            `}
              >
                {item.day_number}
              </div>
            ))}
            <div className="col-span-7 flex justify-end mt-2">
              <button
                className="
      bg-gradient-to-b from-custom-400 to-custom-200
      text-white/70
      border
      border-b-0
      border-custom-300
      px-4
      py-1
      rounded-2xl
      hover:shadow-md
      transition
      mr-2
      mb-3
      text-sm
    "
                onClick={() =>
                  navigate(
                    `/my-challenges/challenge/${data.challenge.id}/insights`,
                  )
                }
              >
                view
              </button>
            </div>
          </div>
        </div>

        {calendar && (
          <DashboardCalendar
            months={calendar}
            onDaySelect={handleGoToCompletedDay}
            onCalendarClick={handleCanlendarClick}
          />
        )}

        {/* Progress */}
        <div
          className="my-6 px-3 border rounded-3xl shadow-lg/30 
      border-custom-200 bg-gradient-to-b from-custom-200 to-custom-400"
        >
          <div className="flex justify-between font-semibold text-sm mb-1 px-2 mt-2">
            <span>Today's Score</span>
            <span>
              {data.today_score} / {data.max_daily_score}
            </span>
          </div>

          <div
            className="w-full bg-gray-300/80 rounded-full h-5 mb-4"
            onClick={handleGoToToday}
          >
            <div
              className={`h-5 rounded-full ${
                data.today_score > 0 && data.today_score < 21
                  ? "bg-red-400 text-black/60 font-semibold"
                  : data.today_score > 20 && data.today_score < 41
                    ? "bg-red-300 text-black/60 font-semibold"
                    : data.today_score > 40 && data.today_score < 61
                      ? "bg-lime-200 text-black/60 font-semibold"
                      : data.today_score > 60 && data.today_score < 81
                        ? "bg-lime-300 text-black/60 font-semibold"
                        : data.today_score > 80 && data.today_score < 91
                          ? "bg-lime-400 text-black/60 font-semibold"
                          : data.today_score > 90
                            ? "bg-lime-500 text-black/60 font-semibold"
                            : ""
              }`}
              style={{
                width: `${(data.today_score / data.max_daily_score) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
      <div className="mb-6">
        <ColorGuide />
      </div>
    </>
  );
}
