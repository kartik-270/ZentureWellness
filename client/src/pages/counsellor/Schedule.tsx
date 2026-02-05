import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { apiConfig } from "@/lib/config";
import CounsellorSidebar from '@/components/CounsellorSidebar';
import { Loader2, Video, Phone, MessageSquare, MapPin } from 'lucide-react';

interface Appointment {
    id: number;
    studentName: string; // Backend needs to send this or we fetch
    date: string;
    time: string;
    mode: string;
    status: string;
}

const customCalendarStyles = `
.react-calendar {
  border: none;
  font-family: inherit;
  width: 100%;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}
.react-calendar__tile {
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 10px;
}
.react-calendar__tile--now {
  background: #eff6ff;
}
.react-calendar__tile--active {
  background: #3b82f6 !important;
  color: white !important;
}
.dot {
  height: 8px;
  width: 8px;
  background-color: #ef4444;
  border-radius: 50%;
  margin-top: 4px;
}
`;

export default function Schedule() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            const token = localStorage.getItem('authToken');
            try {
                // Re-using dashboard data endpoint or similar. 
                // Ideally we should have a specific /counsellor/appointments endpoint but dashboard data has it.
                // Let's assume we can filter from dashboard data or use a new endpoint.
                // For speed, I'll use dashboard data logic from previous files or create a dedicated one if needed.
                // The user didn't explicitly ask for a new endpoint for *schedule* but "show appropriate manner".
                // I'll fetch /counsellor/dashboard-data as it has appointments.
                const res = await fetch(`${apiConfig.baseUrl}/counsellor/dashboard-data`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                // Transform data
                const apps = data.appointments.map((a: any) => {
                    const dateObj = new Date(a.date);
                    // Use en-CA for YYYY-MM-DD format in local time
                    const dateStr = dateObj.toLocaleDateString('en-CA');
                    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return {
                        id: a.id,
                        studentName: a.studentName,
                        date: dateStr,
                        time: timeStr,
                        mode: a.mode,
                        status: a.status
                    };
                });
                setAppointments(apps);
            } catch (err) {
                console.error("Failed to fetch schedule", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    const getDayAppointments = (date: Date) => {
        // Format selected calendar date to YYYY-MM-DD local
        const selectedDateStr = date.toLocaleDateString('en-CA');
        return appointments.filter(a => a.date === selectedDateStr);
    };

    const getTileContent = ({ date, view }: any) => {
        if (view === 'month') {
            const apps = getDayAppointments(date);
            if (apps.length > 0) {
                return <div className="dot"></div>;
            }
        }
        return null;
    };

    const selectedAppointments = getDayAppointments(selectedDate);

    const getModeIcon = (mode: string) => {
        switch (mode) {
            case 'video_call': return <Video size={16} />;
            case 'voice_call': return <Phone size={16} />;
            case 'in_person': return <MapPin size={16} />;
            default: return <MessageSquare size={16} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <CounsellorSidebar />
            <div className="flex-1 overflow-y-auto p-8">
                <style>{customCalendarStyles}</style>
                <h1 className="text-3xl font-bold mb-8">My Schedule</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Calendar Column */}
                    <div>
                        <Calendar
                            onChange={(val) => val instanceof Date && setSelectedDate(val)}
                            value={selectedDate}
                            tileContent={getTileContent}
                            className="shadow-md rounded-lg border-none"
                        />
                    </div>

                    {/* List Column */}
                    <div className="bg-white p-6 rounded-lg shadow-md h-fit min-h-[400px]">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                            {selectedDate.toDateString()}
                        </h2>

                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>
                        ) : selectedAppointments.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No appointments scheduled for this day.</p>
                        ) : (
                            <div className="space-y-4">
                                {selectedAppointments.map(app => (
                                    <div key={app.id} className="p-4 border rounded-lg hover:bg-gray-50 transition border-l-4 border-l-blue-500">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold">{app.studentName}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                    {getModeIcon(app.mode)}
                                                    <span className="capitalize">{app.mode.replace('_', ' ')}</span>
                                                </div>
                                            </div>
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">
                                                {app.time}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs text-right">
                                            <span className={`px-2 py-0.5 rounded ${app.status === 'booked' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
