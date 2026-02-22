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
  category?: 'upcoming' | 'completed' | 'canceled' | 'pending';
  formattedTime?: string;
  formattedDate?: string;
}

interface Client {
  name: string;
  status: string;
  rating: number;
}

const isSessionStarting = (appointmentDate: string) => {
  const now = new Date().getTime();
  const appointmentTime = new Date(appointmentDate).getTime();
  const tenMinutesInMillis = 10 * 60 * 1000;
  // Show button 10 mins before and up to 50 mins after start time
  return appointmentTime - now < tenMinutesInMillis && now - appointmentTime < 50 * 60 * 1000;
};

const formatAppointments = (appointments: Appointment[]): Appointment[] => {
  const now = new Date();
  const sessionDurationInMillis = 50 * 60 * 1000;

  return appointments.map(app => {
    const appTime = new Date(app.date);
    const isPast = (appTime.getTime() + sessionDurationInMillis) < now.getTime();

    let category: 'upcoming' | 'completed' | 'canceled' | 'pending' = 'upcoming';

    if (app.status === 'canceled' || app.status === 'rejected') {
      category = 'canceled';
    } else if (app.status === 'pending') {
      category = 'pending';
    } else if (isPast) {
      category = 'completed';
    }

    return {
      ...app,
      category,
      formattedTime: appTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      formattedDate: appTime.toLocaleDateString(),
    };
  });
};

export default function CounsellorDashboard() {
  const [location, setLocation] = useLocation();
  const [counsellorName, setCounsellorName] = useState<string>("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("No authentication token found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiConfig.baseUrl}/counsellor/dashboard-data`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Optional: Don't throw on 401 during polling to avoid interrupting user? 
            // Better to redirect or show error clearly.
            throw new Error("Your session has expired. Please log in again.");
          }
          // Silent fail on polling error or handle? For now, we set error.
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        localStorage.setItem('username', data.counsellorName);
        setCounsellorName(data.counsellorName);
        // Only update if data changed? React sets state diffing usually handles this reasonably well for this size.
        setAppointments(formatAppointments(data.appointments));
        setClients(data.clients);

      } catch (err: unknown) {
        if (err instanceof Error) {
          // Only set error if it's the first load or a critical auth error
          // Otherwise, transient network errors shouldn't crash the UI during polling
          console.error(err);
          if (loading) setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [location]); // Keep dependency if needed, usually just empty array or location key.

  const handleStartSession = (meetingLink: string) => {
    if (!meetingLink) return;
    window.location.href = meetingLink;
  };

  const handleAction = async (apptId: number, newStatus: 'booked' | 'rejected') => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${apiConfig.baseUrl}/appointments/${apptId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");

      // Refresh local state to reflect change immediately
      setAppointments(prev => formatAppointments(prev.map(app =>
        app.id === apptId ? { ...app, status: newStatus } : app
      )));
    } catch (err) {
      console.error(err);
      setError("Failed to update appointment");
    }
  };

  const pendingAppointments = appointments.filter(app => app.category === 'pending');
  const upcomingAppointments = appointments.filter(app => app.category === 'upcoming');
  const completedAppointments = appointments.filter(app => app.category === 'completed');
  const canceledAppointments = appointments.filter(app => app.category === 'canceled');

  if (loading) return <div className="text-center mt-20">Loading dashboard...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen text-gray-900">
      <div className="flex">
        <CounsellorSidebar />
        <div className="flex-1 p-6 lg:p-10">
          <CounsellorHeader name={counsellorName} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 background-bg">
            <div className="lg:col-span-2 space-y-6">

              {/* Pending Requests Section */}
              {pendingAppointments.length > 0 && (
                <div className="bg-orange-50 p-6 rounded-2xl shadow border border-orange-200">
                  <h3 className="text-xl font-semibold text-orange-800 mb-4">
                    Pending Requests ({pendingAppointments.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingAppointments.map((app) => (
                      <div key={app.id} className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="font-bold">{app.studentName}</p>
                        <p className="text-sm text-gray-600">{app.formattedDate} at {app.formattedTime}</p>
                        <p className="text-xs text-gray-500 mb-3 uppercase font-semibold">{app.mode}</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleAction(app.id, 'booked')} className="flex-1 bg-green-500 text-white py-1 rounded hover:bg-green-600 text-sm">Accept</button>
                          <button onClick={() => handleAction(app.id, 'rejected')} className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600 text-sm">Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white/80 p-6 rounded-2xl shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Upcoming Sessions ({upcomingAppointments.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((app) => (
                      <div key={app.id} className="relative">
                        <SessionCard
                          title={app.studentName}
                          subtitle={app.mode}
                          meta={app.formattedTime}
                        />
                        {isSessionStarting(app.date) && app.mode !== 'in_person' && (
                          <button
                            onClick={() => handleStartSession(app.meeting_link)}
                            className="absolute bottom-2 right-2 px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-all shadow"
                          >
                            Start Session
                          </button>
                        )}
                        {app.mode === 'in_person' && (
                          <div className="absolute bottom-2 right-2 px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-md">
                            In Person
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No confirmed upcoming sessions.</p>
                  )}
                </div>
              </div>

              <aside className="space-y-6">
                <div className="bg-white/80 p-4 rounded-xl shadow">
                  <h4 className="text-sm text-gray-500 uppercase">Today's Overview</h4>
                  <p className="text-2xl font-semibold text-gray-800 mt-2">{upcomingAppointments.length} confirmed</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {pendingAppointments.length} pending • {canceledAppointments.length} cancelled
                  </p>
                </div>
              </aside>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-black shadow-md p-6 rounded-2xl shadow lg:col-start-3 lg:row-start-1">
              {/* Right Column Content - moved here to match grid layout */}
              <h3 className="text-lg font-semibold mb-4">Client List ({clients.length})</h3>
              <div className="space-y-3">
                {clients.length > 0 ? (
                  clients.map((client, i) => (
                    <div key={i} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                          {client.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.status}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">{client.rating} ★</div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No clients found.</p>
                )}
              </div>

              <h3 className="text-lg font-semibold mb-4 mt-8">History ({completedAppointments.length})</h3>
              <div className="space-y-3">
                {completedAppointments.length > 0 ? (
                  completedAppointments.map((app) => (
                    <SessionCard
                      key={app.id}
                      title={`${app.studentName} - Completed`}
                      subtitle={`Mode: ${app.mode}`}
                      meta={app.formattedDate}
                    />
                  ))
                ) : (
                  <p className="text-gray-500">No completed sessions.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}