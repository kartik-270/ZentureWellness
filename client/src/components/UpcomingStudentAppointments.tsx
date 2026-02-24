import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import SessionCard from './SessionCard';
import { apiConfig } from "@/lib/config";

interface UpcomingAppointment {
  id: number;
  counsellorName: string;
  date: string;
  mode: string;
  meeting_link: string;
  status: string; // Added status
  formattedTime?: string;
}

// Helper to check if a session is starting soon or is active
const isSessionStarting = (appointmentDate: string) => {
  const now = new Date().getTime();
  const appointmentTime = new Date(appointmentDate).getTime();
  const tenMinutesInMillis = 10 * 60 * 1000;
  const fiftyMinutesInMillis = 50 * 60 * 1000;

  // Show button 10 mins before start and up to 50 mins after start time
  return appointmentTime - now < tenMinutesInMillis && now - appointmentTime < fiftyMinutesInMillis;
};

export default function UpcomingStudentAppointments() {
  const [appointments, setAppointments] = useState<UpcomingAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const fetchStudentData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${apiConfig.baseUrl}/student/dashboard-data`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch appointments');

        const data = await response.json();
        localStorage.setItem('username', data.studentName);

        const formattedAppointments = data.upcomingAppointments.map((app: any) => ({
          ...app,
          formattedTime: new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setAppointments(formattedAppointments);

      } catch (error) {
        console.error("Could not fetch student appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleJoinSession = (link: string) => {
    if (!link) {
      alert("Session link is not available.");
      return;
    }
    // Force full page navigation to ensure SessionPage loads correctly
    window.location.href = link;
  };

  if (loading) return <p className="text-center">Loading your appointments...</p>;

  // Filter and Sort
  const now = new Date();
  const sorted = [...appointments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcoming = sorted.filter(app => {
    const appTime = new Date(app.date).getTime();
    const fortyFiveMinutesInMillis = 45 * 60 * 1000;
    // Session is upcoming or active (started less than 45 mins ago)
    return appTime + fortyFiveMinutesInMillis >= now.getTime();
  });
  const past = sorted.filter(app => {
    const appTime = new Date(app.date).getTime();
    const fortyFiveMinutesInMillis = 45 * 60 * 1000;
    return appTime + fortyFiveMinutesInMillis < now.getTime();
  }).reverse(); // Most recent past first

  return (
    <section className="w-full max-w-4xl px-4 space-y-12">

      {/* Upcoming Section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Your Upcoming Appointments</h2>
        {upcoming.length === 0 ? (
          <p className="text-center text-gray-500">You have no upcoming appointments.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcoming.map(app => (
              <div key={app.id} className="border-l-4 border-blue-500 rounded-lg overflow-hidden shadow-md transition-shadow hover:shadow-lg">
                <SessionCard
                  title={`With ${app.counsellorName}`}
                  subtitle={`Mode: ${app.mode}`}
                  meta={
                    <div className="flex flex-col items-end gap-2">
                      {app.status === 'pending' && <span className="bg-yellow-100 text-yellow-800 text-[10px] font-semibold px-2 py-0.5 rounded">Pending Approval</span>}
                      {app.status === 'booked' && <span className="bg-green-100 text-green-800 text-[10px] font-semibold px-2 py-0.5 rounded">Confirmed</span>}
                      <div className="text-sm font-semibold text-gray-700">{app.formattedTime}</div>
                    </div>
                  }
                  action={
                    <>
                      {app.status === 'booked' && isSessionStarting(app.date) && app.mode !== 'in_person' && (
                        <button
                          onClick={() => handleJoinSession(app.meeting_link)}
                          className="w-full mt-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all shadow-sm font-bold"
                        >
                          Join Session
                        </button>
                      )}
                      {app.mode === 'in_person' && app.status === 'booked' && (
                        <div className="w-full mt-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg text-center font-medium border border-gray-200">
                          In Person Location
                        </div>
                      )}
                    </>
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Section */}
      {/* {past.length > 0 && (
        <div className="opacity-80">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Past Appointments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {past.map(app => (
              <div key={app.id} className="relative bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <SessionCard
                  title={`With ${app.counsellorName}`}
                  subtitle={`Mode: ${app.mode}`}
                  meta={`${new Date(app.date).toLocaleDateString()} ${app.formattedTime}`}
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}

    </section>
  );
}