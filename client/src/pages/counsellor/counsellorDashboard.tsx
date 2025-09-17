"use client";
import CounsellorSidebar from "@/components/CounsellorSidebar";
import CounsellorHeader from "@/components/CounsellorHeader";
import SessionCard from "@/components/SessionCard";

export default function CounsellorDashboard() {
  const upcoming = [
    { time: "09:30 AM", student: "Aisha Khan", mode: "Video Call" },
    { time: "11:00 AM", student: "Ravi Sharma", mode: "Voice Call" },
  ];

  const clients = [
    { name: "Sana Ali", status: "Active", rating: 4.8 },
    { name: "Manish Verma", status: "Active", rating: 4.6 },
  ];

  return (
    <div className="min-h-screen   text-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <CounsellorSidebar />

        {/* Main area */}
        <div className="flex-1 p-6 lg:p-10">
          <CounsellorHeader name="Dr. Lena Sharma" />

          {/* Grid: Upcoming / Clients / History */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 background-bg">
            {/* Upcoming sessions (large card) */}
            <div className="lg:col-span-2 bg-white/80 p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Upcoming Sessions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcoming.map((s, i) => (
                  <SessionCard
                    key={i}
                    title={s.student}
                    subtitle={s.mode}
                    meta={s.time}
                  />
                ))}
              </div>
            </div>

            {/* Side column: quick stats / actions */}
            <aside className="space-y-6">
              <div className="bg-white/80 p-4 rounded-xl shadow">
                <h4 className="text-sm text-gray-500 uppercase">Today</h4>
                <p className="text-2xl font-semibold text-gray-800 mt-2">2 sessions</p>
                <p className="text-sm text-gray-600 mt-1">Booked • 1 cancelled</p>
              </div>

              <div className="bg-white/80 p-4 rounded-xl shadow">
                <h4 className="text-sm text-gray-500 uppercase">Quick Actions</h4>
                <div className="mt-3 flex flex-col gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Start Session</button>
                  <button className="px-4 py-2 border rounded-lg">View Resources</button>
                </div>
              </div>
            </aside>
          </div>

          {/* Clients and History row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-white/80 p-6 rounded-2xl shadow lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Client List</h3>
              <div className="space-y-3">
                {clients.map((c, i) => (
                  <div key={i} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                        {c.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                      </div>
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-sm text-gray-500">{c.status}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{c.rating} ★</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/80 p-6 rounded-2xl shadow lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Session History</h3>
              <div className="space-y-3">
                <SessionCard title="Follow-up: Aisha Khan" subtitle="Notes added" meta="2 days ago" />
                <SessionCard title="Initial: Ravi Sharma" subtitle="Completed" meta="1 week ago" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}