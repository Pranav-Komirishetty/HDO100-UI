export default function ColorGuide() {
  return (
    <div className="flex-row p-2 my-4 rounded-md border border-neutral-500/70">
      <p className="font-bold text-sm mb-1 text-custom-400">Score Legend</p>
      <div className="grid grid-cols-4">
        <Legend color="bg-red-400" label="0-20" />
        <Legend color="bg-red-300" label="21-40" />
        <Legend color="bg-lime-200" label="41-60" />
        <Legend color="bg-lime-300" label="61-80" />
        <Legend color="bg-lime-400" label="81-90" />
        <Legend color="bg-lime-500" label="91-100" />
        <Legend color="bg-black/60" label="Missed" />
        <Legend color="bg-gray-400/60" label="Upcoming" />
      </div>
    </div>
  );
}

function Legend({ color, label }: any) {
  return (
    <div className="flex mb-2 gap-1">
      <div
        className={`h-4 w-4 rounded  border-[0.75px]  border-neutral-500/70 ${color}`}
      />
      <span className="text-xs">{label}</span>
    </div>
  );
}
