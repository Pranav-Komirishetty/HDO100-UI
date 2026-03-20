import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTasksByDate,
  getTodaysTasks,
  saveTodayLog,
} from "../services/challengeService";
import { useToast } from "../components/ToastContext";
import { useAuth } from "../hooks/useAuth";
import backIcon from "../assets/back.svg";
import { useLoader } from "../components/LoaderContext";

interface Task {
  task_id: string;
  task_name: string;
  points: number;
  completed: boolean;
}

export default function TodayMarkingPage() {
  const { id, date } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [reset, setReset] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const { showLoader, hideLoader } = useLoader();
  const [saving, setSaving] = useState(false);
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  const [allowMarking, setAllowMarking] = useState<boolean>(true);
  const [loggedBy, setLoggedBy] = useState<string>("");
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        showLoader(localStorage.getItem("currentDay"));
        if (date) {
          const data = await getTasksByDate(id!, date);

          setTasks(data.tasks);
          setCurrentDay(data.dayNumber);

          const initialState: Record<string, boolean> = {};
          data.tasks.forEach((t: Task) => {
            initialState[t.task_id] = t.completed;
          });

          data.is_logged_by_user ? setLoggedBy("User") : setLoggedBy("System");
          setAllowMarking(false);
          setChecked(initialState);
        } else {
          const data = await getTodaysTasks(id!);

          setTasks(data.tasks);
          setCurrentDay(data.dayNumber);

          const initialState: Record<string, boolean> = {};
          data.tasks.forEach((t: Task) => {
            initialState[t.task_id] = t.completed;
          });

          setChecked(initialState);
        }
      } catch (err: any) {
        if (err.status === 400) {
          showToast(err.message + " please try tomorrow", "error");

          setTimeout(() => {
            navigate(`/my-challenges/challenge/${id}`);
          }, 1500);
        } else if (err.status === 401) {
          showToast("Session expired. Please login again.", "error");
          logout();
        } else if (err.status === 404) {
          showToast("Challenge not found", "error");
          navigate("/my-challenges");
        } else {
          showToast("Something went wrong", "error");
        }
      } finally {
        hideLoader();
        setReset(false);
      }
    }

    load();
  }, [id, reset]);

  function toggleTask(taskId: string) {
    if (checked[taskId]) return; // no downgrade

    setChecked((prev) => ({
      ...prev,
      [taskId]: true,
    }));
  }

  const totalScore = tasks.reduce((sum, t) => {
    return checked[t.task_id] ? sum + t.points : sum;
  }, 0);

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        tasks: Object.keys(checked)
          .filter((taskId) => checked[taskId])
          .map((taskId) => ({
            task_id: taskId,
            completed: true,
          })),
      };

      await saveTodayLog(id!, payload);

      navigate(`/my-challenges/challenge/${id}`);
    } catch (err: any) {
      if (err.status === 401) {
        showToast("Session expired. Please login again.", "error");
        logout();
      } else {
        showToast("Failed to save", "error");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <button onClick={() => navigate(`/my-challenges/challenge/${id}`)}>
        <img src={backIcon} alt="back" className="h-5 w-5" />
      </button>

      <h1 className="text-lg font-bold mb-2 text-custom-400">
        Day {currentDay} Log
      </h1>

      {!allowMarking && (
        <p className="mb-4 text-sm text-neutral-800">Logged By: {loggedBy}</p>
      )}

      <p className="mb-4 text-sm font-semibold text-neutral-700/70">
        Today's Score: {totalScore}
      </p>

      <div className="space-y-3 mb-6">
        {!allowMarking &&
          tasks.map((task) => (
            <div
              key={task.task_id}
              className={`border rounded-xl p-4 flex justify-between items-center cursor-pointer text-custom-400 ${
                checked[task.task_id]
                  ? "bg-gradient-to-br from-custom-200 to-lime-300 border-custom-300 border-2 border-b-[1px] border-r-[1px] shadow-lg"
                  : "bg-gradient-to-br from-custom-100 via-neutral-700/60 to-neutral-700/80 border-custom-300 border-2 border-b-[1px] border-r-[1px] shadow-lg"
              }`}
            >
              <div>
                <p className="font-medium">{task.task_name}</p>
                <p className="text-xs text-neutral-700/70">{task.points} pts</p>
              </div>

              <div>{checked[task.task_id] ? "Completed ✅" : "Missed ❌"}</div>
            </div>
          ))}

        {allowMarking &&
          tasks.map((task) => (
            <div
              key={task.task_id}
              className={`border rounded-2xl p-4 flex justify-between text-custom-400 items-center cursor-pointer ${
                checked[task.task_id]
                  ? "bg-gradient-to-br from-custom-200 to-lime-300 border-custom-300 border-2 border-b-[1px] border-r-[1px] shadow-lg"
                  : "bg-gradient-to-br from-custom-100 via-neutral-700/60 to-neutral-700/80 border-custom-300 border-2 border-b-[1px] border-r-[1px] shadow-lg"
              }`}
              onClick={() => toggleTask(task.task_id)}
            >
              <div>
                <p className="font-medium">{task.task_name}</p>
                <p className="text-xs text-neutral-700/70">{task.points} pts</p>
              </div>

              <div
                className={`${checked[task.task_id] ? "text-neutral-700" : "text-neutral-300"}`}
              >
                {checked[task.task_id] ? "Done ✅" : "Complete ⬜"}
              </div>
            </div>
          ))}
      </div>

      {allowMarking && (
        <div className="flex gap-2">
          <button
            onClick={() => setReset(true)}
            className="w-full flex-1 bg-gradient-to-br from-custom-100 to-custom-400/80
      text-white/70
      border-2
      border-b-0
      border-custom-300
      py-2
      rounded-2xl
      hover:shadow-md
      transition
      text-sm disabled:opacity-50 mb-6"
          >
            Reset
          </button>
          <button
            disabled={saving}
            onClick={handleSave}
            className="w-full flex-1 bg-gradient-to-br from-custom-400 to-green-500/80
      text-white/70
      border-2
      border-b-0
      border-custom-300
      py-2
      rounded-2xl
      hover:shadow-md
      transition
      text-sm disabled:opacity-50 mb-6"
          >
            {saving ? "Saving..." : "Save Progress"}
          </button>
        </div>
      )}
    </div>
  );
}
