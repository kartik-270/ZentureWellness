import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { io } from "socket.io-client";
import { apiConfig } from "@/lib/config";
import CounsellorSidebar from "@/components/CounsellorSidebar";
import CounsellorHeader from "@/components/CounsellorHeader";
import SessionCard from "@/components/SessionCard";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  Shield,
  Phone,
  Mail,
  User,
  X,
  MessageSquare,
  ArrowRight
} from "lucide-react";

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

  // High-Risk States
  const [highRiskAlerts, setHighRiskAlerts] = useState<any[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [studentConfidential, setStudentConfidential] = useState<any>(null);
  const [showOutreachModal, setShowOutreachModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const socket = io(apiConfig.baseUrl.replace('/api', ''), {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('Counselor connected to Socket.IO');
      socket.emit('join', { room: 'counselor' });
    });

    socket.on('high-risk-alert', (data) => {
      console.log('Received high-risk alert:', data);
      setHighRiskAlerts(prev => [data, ...prev]);
      toast({
        title: "CRITICAL: High-Risk Case Identified",
        description: `${data.username} identified with urgent risk factors.`,
        variant: "destructive"
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('authToken');
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
  if (loading)
    return <div className="text-center mt-20">Loading dashboard...</div>;
  const fetchStudentConfidential = async (studentId: number) => {
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`${apiConfig.baseUrl}/counselor/student/${studentId}/confidential`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setStudentConfidential(await res.json());
        setShowOutreachModal(true);
      }
    } catch (err) {
      console.error("Failed to fetch student info:", err);
      toast({
        title: "Error",
        description: "Could not fetch student contact details.",
        variant: "destructive"
      });
    }
  };

  const handleReviewAlert = (alert: any) => {
    setSelectedAlert(alert);
    fetchStudentConfidential(alert.user_id);
  };

  const pendingAppointments = appointments.filter(app => app.category === 'pending');
  const upcomingAppointments = appointments.filter(app => app.category === 'upcoming');
  const completedAppointments = appointments.filter(app => app.category === 'completed');
  const canceledAppointments = appointments.filter(app => app.category === 'canceled');

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

              {/* High-Risk Alerts Section (Real-Time) */}
              {highRiskAlerts.length > 0 && (
                <div className="bg-red-50 p-6 rounded-2xl shadow-xl border-2 border-red-200 animate-pulse-slow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-red-800 flex items-center gap-2">
                      <AlertTriangle size={24} /> Urgent Action Required ({highRiskAlerts.length})
                    </h3>
                    <Shield className="text-red-500" />
                  </div>
                  <div className="space-y-3">
                    {highRiskAlerts.map((alert, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-red-100 flex items-center justify-between group hover:shadow-md transition-all">
                        <div>
                          <p className="font-bold text-gray-900">{alert.username}</p>
                          <p className="text-sm text-red-600 font-medium italic">"{alert.message.substring(0, 60)}..."</p>
                          <div className="flex gap-2 mt-2">
                            {alert.risk_factors?.map((f: string, fi: number) => (
                              <span key={fi} className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full uppercase">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => handleReviewAlert(alert)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-red-700 transition-colors"
                        >
                          Outreach Now <ArrowRight size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Requests Section */}
              {pendingAppointments.length > 0 && (
                <div className="bg-orange-50 p-6 rounded-2xl shadow border border-orange-200">
                  <h3 className="text-xl font-semibold text-orange-800 mb-4">
                    Pending Requests ({pendingAppointments.length})
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {pendingAppointments.map((app) => (
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
                  Upcoming Sessions ({upcomingAppointments.length})
                </h3>
                <div className="space-y-4">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((app) => (
                      <SessionCard
                        key={app.id}
                        title={app.studentName}
                        subtitle={app.mode}
                        meta={app.formattedTime}
                        action={
                          isSessionStarting(app.date) && app.mode !== "in_person" && (
                            <button
                              onClick={() => handleStartSession(app.meeting_link)}
                              className="w-full px-3 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-all font-medium"
                            >
                              Start Session
                            </button>
                          )
                        }
                      />
                    ))
                  ) : (
                    <p className="text-gray-500">No confirmed sessions.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Outreach / Confidential Info Modal */}
      {showOutreachModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transform transition-all">
            <div className="p-6 bg-red-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Shield size={24} />
                <h3 className="text-xl font-bold">Direct Student Outreach</h3>
              </div>
              <button onClick={() => setShowOutreachModal(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-2xl mx-auto mb-4 border-4 border-white shadow-lg">
                  {studentConfidential?.name[0]}
                </div>
                <h4 className="text-2xl font-bold text-gray-800">{studentConfidential?.name}</h4>
                <p className="text-red-500 font-bold flex items-center justify-center gap-1">
                  <AlertTriangle size={14} /> High-Risk Crisis Case
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4 group hover:border-blue-200 transition-colors">
                  <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                    <Phone size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500 uppercase font-extrabold tracking-widest">Phone Number</p>
                    <p className="text-lg font-bold text-gray-800">{studentConfidential?.phone}</p>
                  </div>
                  <a href={`tel:${studentConfidential?.phone}`} className="p-2 bg-blue-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    Call
                  </a>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4 group hover:border-purple-200 transition-colors">
                  <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500 uppercase font-extrabold tracking-widest">Email Address</p>
                    <p className="text-base font-bold text-gray-800">{studentConfidential?.email}</p>
                  </div>
                  <a href={`mailto:${studentConfidential?.email}`} className="p-2 bg-purple-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    Email
                  </a>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-[10px] text-red-500 uppercase font-extrabold mb-2">Emergency Contact (Parent)</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{studentConfidential?.parent_name}</span>
                      <span className="font-bold text-red-600">{studentConfidential?.parent_phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => window.location.href = `/counsellor/chat?studentId=${selectedAlert?.user_id}`}
                  className="flex-1 py-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
                >
                  <MessageSquare size={18} /> Open Direct Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}