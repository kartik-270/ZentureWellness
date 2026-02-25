import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { apiConfig } from "@/lib/config";
import CounsellorSidebar from "@/components/CounsellorSidebar";
import CounsellorHeader from "@/components/CounsellorHeader";
import SessionCard from "@/components/SessionCard";

interface Appointment {
  id: number;
  studentName: string;
  date: string;
  mode: string;
  status: string;
  meeting_link: string;
  category?: "upcoming" | "completed" | "canceled" | "pending";
  formattedTime?: string;
  formattedDate?: string;
}

interface Client {
  name: string;
  status: string;
  rating: number;
}

const SESSION_DURATION = 45 * 60 * 1000;

const isSessionStarting = (appointmentDate: string) => {
  const now = Date.now();
  const appointmentTime = new Date(appointmentDate).getTime();

  return (
    appointmentTime - now <= 10 * 60 * 1000 &&
    now - appointmentTime <= SESSION_DURATION
  );
};

const formatAppointments = (appointments: Appointment[]): Appointment[] => {
  const now = Date.now();

  return appointments.map((app) => {
    const appTime = new Date(app.date).getTime();
    const isPast = appTime + SESSION_DURATION < now;

    let category: Appointment["category"] = "upcoming";

    if (app.status === "canceled" || app.status === "rejected") {
      category = "canceled";
    } else if (app.status === "pending") {
      category = "pending";
    } else if (isPast) {
      category = "completed";
    }

    return {
      ...app,
      category,
      formattedTime: new Date(app.date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      formattedDate: new Date(app.date).toLocaleDateString(),
    };
  });
};

export default function CounsellorDashboard() {
  const [, setLocation] = useLocation();
  const [counsellorName, setCounsellorName] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Session expired. Please login again.");
      setLocation("/login");
      return;
    }

    try {
      const response = await fetch(
        `${apiConfig.baseUrl}/counsellor/dashboard-data`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("authToken");
        setLocation("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();

      setCounsellorName(data.counsellorName);
      setAppointments(formatAppointments(data.appointments || []));
      setClients(data.clients || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 30000); // auto refresh every 30 sec
    return () => clearInterval(interval);
  }, []);

  const handleStartSession = (meetingLink: string) => {
    if (meetingLink) window.open(meetingLink, "_blank");
  };

  const handleAction = async (
    apptId: number,
    newStatus: "booked" | "rejected"
  ) => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(
        `${apiConfig.baseUrl}/appointments/${apptId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error();

      setAppointments((prev) =>
        formatAppointments(
          prev.map((app) =>
            app.id === apptId ? { ...app, status: newStatus } : app
          )
        )
      );
    } catch {
      setError("Failed to update appointment.");
    }
  };

  const pending = appointments.filter((a) => a.category === "pending");
  const upcoming = appointments.filter((a) => a.category === "upcoming");
  const completed = appointments.filter((a) => a.category === "completed");
  const canceled = appointments.filter((a) => a.category === "canceled");

  if (loading)
    return <div className="text-center mt-20">Loading dashboard...</div>;

  if (error)
    return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen text-gray-900">
      <div className="flex">
        <CounsellorSidebar />
        <div className="flex-1 p-6 lg:p-10">
          <CounsellorHeader name={counsellorName} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 space-y-6">

              {/* Pending Section */}
              {pending.length > 0 && (
                <div className="bg-orange-50 p-6 rounded-2xl shadow border border-orange-200">
                  <h3 className="text-xl font-semibold text-orange-800 mb-4">
                    Pending Requests ({pending.length})
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {pending.map((app) => (
                      <div key={app.id} className="bg-white p-4 rounded-lg shadow">
                        <p className="font-bold">{app.studentName}</p>
                        <p className="text-sm text-gray-600">
                          {app.formattedDate} at {app.formattedTime}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleAction(app.id, "booked")}
                            className="flex-1 bg-green-500 text-white py-1 rounded"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleAction(app.id, "rejected")}
                            className="flex-1 bg-red-500 text-white py-1 rounded"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-xl font-semibold mb-4">
                  Upcoming Sessions ({upcoming.length})
                </h3>
                {upcoming.length === 0 && (
                  <p className="text-gray-500">No confirmed sessions.</p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}