export default function CounsellorHeader({ name }: { name: string }) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md rounded-2xl p-6 flex items-center justify-between shadow">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome, {name}</h1>
        <p className="text-sm text-white/80 mt-1">Here’s your overview for today.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm text-white/80">Today</div>
          <div className="font-medium">Sep 10, 2025</div>
        </div>
        <img
          src="data:image/jpeg;base64,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"
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>
    </header>
  );
}