export default function CounsellorHeader({ name }: { name: string }) {
  return (
    <header className="bg-white/70 rounded-2xl p-6 flex items-center justify-between shadow">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {name}</h1>
        <p className="text-sm text-gray-500 mt-1">Here’s your overview for today.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm text-gray-500">Today</div>
          <div className="font-medium">Sep 10, 2025</div>
        </div>
        <img
          src="/profile-placeholder.png"
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>
    </header>
  );
}