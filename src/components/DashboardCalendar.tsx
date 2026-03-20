import { useMemo, useState } from "react";
import navArrowIcon from "../assets/left-arrow.svg";

interface CalendarProps {
  months: any[];
  onDaySelect: any;
  onCalendarClick: any;
}

export default function DashboardCalendar({
  months,
  onDaySelect,
  onCalendarClick,
}: CalendarProps) {
  const initialIndex = useMemo(() => {
    const index = months.findIndex((month) =>
      month.days.some((day: any) => day.is_today),
    );
    return index !== -1 ? index : months.length - 1;
  }, [months]);

  const [monthIndex, setMonthIndex] = useState(initialIndex);

  const currentMonth = months[monthIndex];
  const firstDay = new Date(currentMonth.days[0].date);
  let startOffset = firstDay.getDay();

  // convert Sunday=0 → 6, Monday=1 → 0
  startOffset = startOffset === 0 ? 6 : startOffset - 1;

  const canGoPrev = monthIndex > 0;
  const canGoNext = monthIndex < months.length - 1;

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
    <div
      className="mt-6 p-4 shadow-xl border rounded-2xl inset-shadow-sm
      border-custom-200 bg-gradient-to-b from-custom-200 to-custom-400"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <button
          disabled={!canGoPrev}
          onClick={() => setMonthIndex((prev) => prev - 1)}
          className="text-lg disabled:opacity-30"
        >
          <img src={navArrowIcon} alt="aro" className="w-6" />
        </button>

        <h2 className="font-semibold text-lg">{currentMonth.label}</h2>

        <button
          disabled={!canGoNext}
          onClick={() => setMonthIndex((prev) => prev + 1)}
          className="text-lg disabled:opacity-30"
        >
          <img src={navArrowIcon} alt="aro" className="w-6 rotate-180" />
        </button>
      </div>

      {/* WEEKDAY HEADER */}
      <div className="grid grid-cols-7 text-xs text-black/70 font-bold mb-2">
        {[
          { id: "monday", dL: "M" },
          { id: "tuesday", dL: "T" },
          { id: "wednesday", dL: "W" },
          { id: "thursday", dL: "T" },
          { id: "friday", dL: "F" },
          { id: "saturday", dL: "S" },
          { id: "sunday", dL: "S" },
        ].map((d) => (
          <div key={d.id} className="text-center">
            {d.dL}
          </div>
        ))}
      </div>

      {/* DAYS GRID */}
      <div className="grid grid-cols-7 gap-1 text-sm">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={"empty-" + i} />
        ))}
        {currentMonth.days.map((day: any) => (
          <div
            key={day.date}
            onClick={() => onDaySelect(day.date, day.is_today, day.day_number)}
            className={`h-8 flex items-center justify-center rounded-lg p-1
              ${getColor(day)} 
              ${day.is_today ? "outline-dashed outline-zinc-900/80 outline-2 shadow-md shadow-black" : ""}
            `}
          >
            {new Date(day.date).getDate()}
          </div>
        ))}
      </div>
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
      mt-1
      text-sm
    "
          onClick={() => onCalendarClick(true)}
        >
          view
        </button>
      </div>
    </div>
  );
}
