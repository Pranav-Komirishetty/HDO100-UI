import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getChallengeDetails,
  createDraftChallenge,
  updateDraftChallenge,
  startChallenge,
  deleteChallenge,
} from "../services/challengeService";
import ConfirmationModal from "../components/ConfirmationModal";
import { useToast } from "../components/ToastContext";
import { useAuth } from "../hooks/useAuth";
import navArrowIcon from "../assets/left-arrow.svg";
import backIcon from "../assets/back.svg";
import { useLoader } from "../components/LoaderContext";

type Task = {
  id?: string;
  task_name: string;
  points: number;
};

export default function ChallengeEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { logout } = useAuth();

  const [name, setName] = useState("");
  const [tasks, setTasks] = useState<Task[]>([{ task_name: "", points: 1 }]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskIndex, setTaskIndex] = useState(0);
  const [showStartModal, setShowStartModal] = useState(false);
  const { showLoader, hideLoader } = useLoader();

  const canGoPrev = taskIndex > 0;
  const canGoNext = taskIndex < tasks.length - 1;

  const taskRefs = useRef<(HTMLInputElement | null)[]>([]);

  const totalPoints = tasks.reduce(
    (sum, task) => sum + (Number(task.points) || 0),
    0,
  );

  // Load draft if editing
  useEffect(() => {
    if (!id) {
      hideLoader();
      return;
    }

    async function fetchDraft() {
      try {
        showLoader(localStorage.getItem("currentDay"));
        const data = await getChallengeDetails(id as string);

        setName(data.name);
        setTasks(
          data.tasks.map((t: any) => ({
            id: t.id,
            task_name: t.task_name,
            points: t.points,
          })),
        );
      } catch (err: any) {
        if (err.status === 401) {
          showToast("Session expired. Please login again.", "error");
          logout();
        } else {
          showToast("Failed to load challenge", "error");
          navigate("/create");
        }
      } finally {
        hideLoader();
      }
    }

    fetchDraft();
  }, [id]);

  // Auto focus new task
  useEffect(() => {
    if (tasks.length > 0) {
      const lastIndex = tasks.length - 1;
      const el = taskRefs.current[lastIndex];
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [tasks.length]);

  function handleAddTask() {
    if (tasks.length > 0) {
      const lastTask = tasks[tasks.length - 1];

      if (!lastTask.task_name.trim()) {
        showToast("Please enter task name before adding another task", "error");
        return;
      }
    }

    setTasks([...tasks, { task_name: "", points: 1 }]);
    setTaskIndex(tasks.length);
  }

  function handleRemoveTask(index: number) {
    const updated = [...tasks];
    updated.splice(index, 1);
    setTasks(updated);
  }

  function handleTaskChange(
    index: number,
    field: "task_name" | "points",
    value: string,
  ) {
    const updated = [...tasks];

    if (field === "points") {
      updated[index].points = Number(value);
    } else {
      updated[index].task_name = value;
    }

    setTasks(updated);
  }

  async function handleSave() {
    if (name.trim().length < 3) {
      showToast("Challenge name must be at least 3 characters","info");
      return;
    }

    try {
      let challengeId;
      const cleanedTasks = tasks.map(({ task_name, points }) => ({
        task_name,
        points,
      }));
      if (!id) {
        const data = await createDraftChallenge({
          name,
          tasks: cleanedTasks,
        });

        const newId = data.challenge.id;
        navigate(`/create/${newId}`);
        challengeId = newId;
      } else {
        await updateDraftChallenge(id, {
          name,
          tasks: cleanedTasks,
        });
        challengeId = id;
      }

      showToast("Draft saved", "success");
      return challengeId;
    } catch (err: any) {
      if (err.status === 401) {
        showToast("Session expired. Please login again.", "error");
        logout();
      } else {
        setTimeout(() => {
          setShowStartModal(false);
        }, 1500);
        showToast("Failed to save draft", "error");
      }
    }
  }

  async function handleSaveAndStart() {
    try {
      const challengeId = await handleSave();

      if (!challengeId) return "failed";

      await startChallenge(challengeId);

      navigate("/dashboard");

      setTimeout(() => {
        showToast("your new challenge has been started", "info");
      }, 2000);
    } catch (err: any) {
      if (err.status === 401) {
        showToast("Session expired. Please login again.", "error");
        logout();
      } else {
        showToast(err.message, "error");
        setTimeout(() => {
          setShowStartModal(false);
        }, 1500);
        return "failed";
      }
    }
  }

  async function confirmDelete() {
    try {
      await deleteChallenge(id!);
      navigate("/create");
    } catch (err: any) {
      if (err.status === 401) {
        showToast("Session expired. Please login again.", "error");
        logout();
      } else {
        showToast("Delete failed", "error");
      }
    }
  }

  return (
    <div className="p-4 pb-28">
      <div className="flex items-center mb-4 text-custom-400">
        <button onClick={() => navigate("/create")} className="mr-3">
          <img src={backIcon} alt="back" className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold">
          {id ? "Edit Challenge" : "Create Challenge"}
        </h1>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-1 ml-1">
          Challenge Name:
        </label>
        <input
          type="text"
          className="w-full border border-black/35 border-b-[0.75px] border-r-[0.75px] bg-gradient-to-br from-slate-50 via-slate-200 to-slate-400 rounded-lg p-2
          focus:outline-none focus:ring-1 focus:drop-shadow-lg focus:ring-custom-300"
          placeholder="Enter your challenge name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <p className="text-sm">
          Tasks Added - <span className="font-semibold">{tasks.length}</span>
        </p>
        <p className="text-sm flex justify-between mt-1">
          Total Score
          <span
            className={`font-semibold ${
              totalPoints === 100 ? "text-green-600" : "text-red-600"
            }`}
          >
            {totalPoints} / 100
          </span>
        </p>
        <div className="w-full bg-gray-300/80 rounded-full h-3 mb-4 mt-1 outline outline-[0.75px]">
          <div
            className={`h-3 rounded-full ${
              totalPoints > 0 && totalPoints < 21
                ? "bg-red-400"
                : totalPoints > 20 && totalPoints < 41
                  ? "bg-red-300"
                  : totalPoints > 40 && totalPoints < 61
                    ? "bg-amber-300"
                    : totalPoints > 60 && totalPoints < 81
                      ? "bg-yellow-400"
                      : totalPoints > 80 && totalPoints < 100
                        ? "bg-green-400"
                        : totalPoints == 100
                          ? "bg-lime-500"
                          : totalPoints > 100
                            ? "bg-red-600"
                            : ""
            }`}
            style={{
              width: `${totalPoints> 100 ? 100 : (totalPoints / 100) * 100 }%`,
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* HEADER NAVIGATION */}
        <div className="flex items-center justify-around">
          <button
            disabled={!canGoPrev}
            onClick={() => setTaskIndex((prev) => prev - 1)}
            className="text-lg disabled:opacity-30"
          >
            <img src={navArrowIcon} alt="aro" className="w-6" />
          </button>

          <div className="grid grid-cols-10 gap-1">
            {tasks.map((_, indx) => (
              <button
                key={indx}
                className={`h-5 w-5 rounded-full border-[0.75px] border-black/40 flex items-center justify-center text-xs
        ${
          indx === taskIndex
            ? "text-white bg-gradient-to-br from-custom-300 to-custom-400"
            : "text-black bg-gradient-to-br from-slate-100 to-neutral-400"
        }
        `}
                onClick={() => {
                  setTaskIndex(indx);
                }}
              >
                {indx + 1}
              </button>
            ))}
          </div>

          <button
            disabled={!canGoNext}
            onClick={() => setTaskIndex((prev) => prev + 1)}
            className="text-lg disabled:opacity-30"
          >
            <img src={navArrowIcon} alt="aro" className="w-6 rotate-180" />
          </button>
        </div>

        {/* TASK EDITOR */}
        <div className="border rounded-xl p-2 space-y-3 bg-gradient-to-br from-custom-200 to-orange-300">
          <input
            type="text"
            placeholder="Task Name"
            className="w-full border border-black/35 border-b-[0.75px] border-r-[0.75px] bg-gradient-to-br from-slate-50 via-slate-200 to-slate-400 rounded-lg p-2
      focus:outline-none focus:ring-1 focus:drop-shadow-lg focus:ring-custom-300"
            value={tasks[taskIndex]?.task_name}
            onChange={(e) =>
              handleTaskChange(taskIndex, "task_name", e.target.value)
            }
          />

          <div className="w-full mt-2">
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={tasks[taskIndex]?.points}
              onChange={(e) =>
                handleTaskChange(taskIndex, "points", e.target.value)
              }
              className="custom-slider w-full"
            />

            <div className="flex items-center justify-between mb-1 mt-2">
              <span className="text-sm font-semibold text-gray-700">
                Score {tasks[taskIndex]?.points}
              </span>
              <button
                onClick={() => handleRemoveTask(taskIndex)}
                className="text-red-500 text-sm border border-slate-400 bg-slate-100 px-2 rounded-md"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleAddTask}
        className=" mt-4 py-3 
        w-full 
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
        + Add Task
      </button>

      <div className="flex justify-between mt-7 mb-7">
        {id && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex-1 bg-gradient-to-br from-custom-400 to-red-300
      text-white/70
      border-2
      border-b-0
      border-custom-300
      py-2
      rounded-2xl
      hover:shadow-md
      transition
      text-sm"
          >
            Delete
          </button>
        )}

        <button
          onClick={handleSave}
          className="flex-1 bg-gradient-to-br from-custom-400 to-custom-100
      text-white/70
      border-2
      border-b-0
      border-custom-300
      py-2
      rounded-2xl
      hover:shadow-md
      transition
      text-sm mx-2
      "
        >
          Save
        </button>

        <button
          onClick={() => {
            setShowStartModal(true);
          }}
          disabled={
            name.trim().length < 3 || tasks.length < 3 || totalPoints !== 100
          }
          className="flex-1 bg-gradient-to-br from-custom-400 to-custom-200
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
          Save & Start
        </button>
      </div>
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Draft?"
        message="This draft will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        successMessage="challenge deleted successfully"
        failMessage="failed to delete challenge"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
      <ConfirmationModal
        isOpen={showStartModal}
        title="Start Challenge?"
        message="Once started, tasks cannot be edited."
        confirmText="Start"
        variant="success"
        successMessage="Challenge started"
        failMessage="Failed to start challenge"
        onCancel={() => setShowStartModal(false)}
        onConfirm={handleSaveAndStart}
      />
    </div>
  );
}
