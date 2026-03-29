export default function Instructions({ onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-6">
      <div className="bg-transperent border backdrop-blur-sm p-6 rounded-xl max-w-md">
        <h2 className="text-xl text-white font-bold mb-4">How to Use</h2>

        <ul className="space-y-2 text-sm text-gray-400">
          <li>✅ Create your challenge</li>
          <li>✅ Add daily tasks</li>
          <li>✅ Complete tasks daily and Log them</li>
          <li>🔥 Maintain streaks</li>
          <li>📊 Track progress</li>
          <li>Note: Daily Task Logging is between <br></br> 2:00 AM<span className="text-gray-600 text-xs">{" (current day)"}</span> - 1:59 AM<span className="text-gray-600 text-xs">{" (next day)"}</span></li>
        </ul>

       <div className="flex justify-end">
         <button
          onClick={onClose}
          className="mt-4 bg-custom-400/70 text-white px-4 py-2 rounded-full"
        >
          Close
        </button>
       </div>
      </div>
    </div>
  );
}