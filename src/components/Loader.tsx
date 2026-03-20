export default function Loader({ day = 0 }: { day?: number }) {
    if(day == undefined){
        day = 0;
    } 
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5">

        {/* Spinner Ring */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-neutral-700"></div>

          <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>

          {/* Day Counter */}
          <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-neutral-200">
            {day}/100
          </div>
        </div>

        <p className="text-neutral-300 text-sm tracking-wide">
          Loading...
        </p>

      </div>
    </div>
  );
}