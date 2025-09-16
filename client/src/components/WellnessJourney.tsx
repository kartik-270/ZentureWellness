"use client";

import { useState, useEffect } from "react";
import { BookText, CalendarCheck2, Loader2, LineChart, Video, Info, Laptop, Users, History, PenSquare } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- Interfaces for our data structures ---
interface Appointment {
  id: number;
  appointment_time: string;
  status: string;
  mode: 'video_call' | 'in_person' | 'message' | 'voice_call';
  meeting_link: string | null;
}

interface MoodEntry {
    mood: string;
    date: string;
}

interface ActivitySummary {
    journalEntriesThisWeek: number;
    assessmentsCompleted: number;
}

interface ChartData {
    day: string;
    mood: string;
    value: number;
}

// --- CHANGE 1: Add an interface for a Journal Entry ---
interface JournalEntry {
  id: number;
  title: string;
  date: string;
  snippet: string;
}


// --- Component ---
export default function WellnessJourney() {
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [activitySummary, setActivitySummary] = useState<ActivitySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [joinableSessions, setJoinableSessions] = useState<Set<number>>(new Set());
  // --- CHANGE 2: Add state to hold journal entries ---
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  // Helper to convert mood to a numerical value for charting
  const moodToValue = (mood: string): number => {
      switch(mood.toLowerCase()){
          case 'excellent': return 5;
          case 'good': return 4;
          case 'okay': return 3;
          case 'stressed': return 2;
          case 'sad': return 1;
          default: return 0;
      }
  }

  // Effect for fetching all initial dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("User not authenticated");

        const headers = { "Authorization": `Bearer ${token}` };

        // --- CHANGE 3: Add journal data fetching to Promise.all ---
        const [
          appointmentsRes,
          moodHistoryRes,
          activitySummaryRes
          
        ] = await Promise.all([
          fetch("https://zenture-backend.onrender.com/api/appointments", { headers }),
          fetch("https://zenture-backend.onrender.com/api/mood-history", { headers }),
          fetch("https://zenture-backend.onrender.com/api/dashboard/activity-summary", { headers }),
          // Assuming this is the endpoint
        ]);

        if (!appointmentsRes.ok || !moodHistoryRes.ok || !activitySummaryRes.ok ) {
            throw new Error("Failed to fetch dashboard data");
        }

        // Process Appointments
        const allAppointments: Appointment[] = await appointmentsRes.json();
        const now = new Date();
        const future: Appointment[] = [];
        const past: Appointment[] = [];

        allAppointments.forEach(app => {
            if (new Date(app.appointment_time) > now) {
                future.push(app);
            } else {
                past.push(app);
            }
        });

        future.sort((a, b) => new Date(a.appointment_time).getTime() - new Date(b.appointment_time).getTime());
        past.sort((a, b) => new Date(b.appointment_time).getTime() - new Date(a.appointment_time).getTime());

        setUpcomingAppointments(future);
        setPastAppointments(past);

        // Process Mood History into Chart Data
        const moodData: MoodEntry[] = await moodHistoryRes.json();
        const formattedChartData = moodData.map(entry => ({
            day: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
            mood: entry.mood,
            value: moodToValue(entry.mood)
        }));
        setChartData(formattedChartData);

        // Process Activity Summary
        const summaryData: ActivitySummary = await activitySummaryRes.json();
        setActivitySummary(summaryData);

        // --- CHANGE 4: Process and set journal entries state ---
        const recentJournals: JournalEntry[] = await journalsRes.json();
        recentJournals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setJournalEntries(recentJournals);


      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Effect for handling the "Join" button visibility
  useEffect(() => {
    if (upcomingAppointments.length === 0) return;
    const checkTimes = () => {
        const now = new Date().getTime();
        const newJoinableIds = new Set<number>();
        upcomingAppointments.forEach(app => {
            if (app.mode === 'video_call' || app.mode === 'voice_call') {
                const appointmentTime = new Date(app.appointment_time).getTime();
                const timeUntilAppointment = appointmentTime - now;
                const tenMinutesInMillis = 10 * 60 * 1000;
                if (timeUntilAppointment <= tenMinutesInMillis && timeUntilAppointment > 0) {
                    newJoinableIds.add(app.id);
                }
            }
        });
        const areSetsEqual = (setA: Set<number>, setB: Set<number>): boolean => {
            if (setA.size !== setB.size) return false;
            let isEqual = true;
            setA.forEach(id => { if (!setB.has(id)) isEqual = false; });
            return isEqual;
        };
        if (!areSetsEqual(newJoinableIds, joinableSessions)) {
            setJoinableSessions(newJoinableIds);
        }
    };
    checkTimes();
    const interval = setInterval(checkTimes, 30000);
    return () => clearInterval(interval);
  }, [upcomingAppointments, joinableSessions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const formatMode = (mode: Appointment['mode']) => {
      switch(mode) {
          case 'video_call': return { text: 'Online Video', icon: <Laptop size={16} /> };
          case 'in_person': return { text: 'In-Person', icon: <Users size={16} /> };
          default: return { text: 'Online', icon: <Laptop size={16} /> };
      }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
          return (
              <div className="bg-background/80 backdrop-blur-sm border border-border p-2 rounded-lg shadow-lg">
                  <p className="font-bold text-foreground">{`${label}`}</p>
                  <p className="text-sm" style={{ color: 'hsl(var(--primary))' }}>{`Mood: ${payload[0].payload.mood}`}</p>
              </div>
          );
      }
      return null;
  };

  const yAxisTickFormatter = (value: number) => {
      switch(value) {
          case 1: return 'Sad';
          case 3: return 'Okay';
          case 5: return 'Excellent';
          default: return '';
      }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <h2 className="text-3xl font-bold text-foreground mb-8">Your Wellness Journey</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- CHANGE 5: Create a wrapper for the left column to hold chart and journals --- */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Weekly Mood Trend Chart */}
            <div className="bg-card gradient-bg border border-border rounded-2xl p-6 shadow-sm h-[320px] flex flex-col">
              <h3 className="text-xl font-semibold text-foreground mb-4">Weekly Mood Trend</h3>
              <div className="flex-grow">
                 {isLoading ? (
                   <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" /></div>
                 ) : chartData.length > 0 ? (
                   <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                           <defs>
                               <linearGradient id="moodColorGradient" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#84cc16" stopOpacity={0.5}/>
                                   <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                   <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                               </linearGradient>
                           </defs>
                           <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                           <YAxis 
                               stroke="#94a3b8" 
                               fontSize={12} 
                               tickLine={false} 
                               axisLine={false}
                               tickFormatter={yAxisTickFormatter}
                               domain={[0, 6]}
                               ticks={[1, 3, 5]}
                           />
                           <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsla(var(--primary), 0.1)' }} />
                           <Area type="monotone" dataKey="value" stroke="#84cc16" strokeWidth={2} fillOpacity={1} fill="url(#moodColorGradient)" />
                       </AreaChart>
                   </ResponsiveContainer>
                 ) : (
                   <div className="flex items-center justify-center h-full"><p className="text-muted-foreground">No mood check-ins this week.</p></div>
                 )}
              </div>
            </div>

            {/* --- CHANGE 6: Add the new Recent Journal Entries component --- */}
            <div className="bg-card gradient-bg border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BookText size={22} />
                    Recent Journal Entries
                </h3>
                {isLoading ? (
                    <div className="flex justify-center items-center h-24"><Loader2 className="animate-spin text-primary" /></div>
                ) : journalEntries.length > 0 ? (
                    <div className="space-y-4">
                        {journalEntries.slice(0, 3).map(entry => ( // Show up to 3 recent entries
                            <div key={entry.id} className="bg-secondary/20 p-4 rounded-lg border-l-4 border-secondary/50">
                                <p className="font-bold text-foreground">{entry.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">{formatDate(entry.date).date}</p>
                                <p className="text-sm text-foreground/80 mt-2 line-clamp-2">{entry.snippet}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">You have no recent journal entries.</p>
                )}
            </div>
        </div>

        {/* Activity & Appointments Column */}
        <div className="flex flex-col gap-6">
            <div className="bg-card gradient-bg border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-4">Activity This Week</h3>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-primary" /></div>
                ) : (
                    <ul className="space-y-4">
                        <li className="flex items-center gap-4">
                            <div className="bg-primary/20 p-2 rounded-lg"><BookText className="text-primary" size={20} /></div>
                            <p className="text-muted-foreground"><span className="font-bold text-foreground">{activitySummary?.journalEntriesThisWeek ?? 0}</span> Journal Entries</p>
                        </li>
                        <li className="flex items-center gap-4">
                            <div className="bg-primary/20 p-2 rounded-lg"><LineChart className="text-primary" size={20} /></div>
                            <p className="text-muted-foreground"><span className="font-bold text-foreground">{activitySummary?.assessmentsCompleted ?? 0}</span> Assessments</p>
                        </li>
                    </ul>
                )}
            </div>
            
            {!isLoading && (
              <div className="bg-card gradient-bg border border-border rounded-2xl p-6 shadow-sm animate-fade-in space-y-4">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <CalendarCheck2 size={22} />
                      Upcoming Appointments
                  </h3>
                  {upcomingAppointments.length > 0 ? (
                      upcomingAppointments.map((appointment) => (
                          <div key={appointment.id} className="bg-primary/10 border-l-4 border-primary/50 p-4 rounded-lg">
                              <p className="font-bold text-foreground">
                                  {formatDate(appointment.appointment_time).date} at {formatDate(appointment.appointment_time).time}
                              </p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/80 mt-2">
                                  <p className="flex items-center gap-1.5 capitalize">{formatMode(appointment.mode).icon}{formatMode(appointment.mode).text}</p>
                                  <p className="flex items-center gap-1.5 capitalize"><Info size={16} />Status: {appointment.status}</p>
                              </div>
                              {joinableSessions.has(appointment.id) && (
                                  <a href={appointment.meeting_link || '#'} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                                      <Video className="mr-2 h-5 w-5" /> Join Session Now
                                  </a>
                              )}
                          </div>
                      ))
                  ) : (
                      <p className="text-muted-foreground text-sm">You have no upcoming appointments scheduled.</p>
                  )}
              </div>
            )}
            
            {!isLoading && pastAppointments.length > 0 && (
              <div className="bg-card gradient-bg border border-border rounded-2xl p-6 shadow-sm animate-fade-in space-y-4">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <History size={22} />
                      Past Appointments
                  </h3>
                  {pastAppointments.map((appointment) => (
                      <div key={appointment.id} className="bg-secondary/20 border-l-4 border-secondary/50 p-4 rounded-lg opacity-70">
                          <p className="font-bold text-foreground">
                              {formatDate(appointment.appointment_time).date} at {formatDate(appointment.appointment_time).time}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/80 mt-2">
                              <p className="flex items-center gap-1.5 capitalize">{formatMode(appointment.mode).icon}{formatMode(appointment.mode).text}</p>
                              <p className="flex items-center gap-1.5 capitalize"><Info size={16} />Status: {appointment.status}</p>
                          </div>
                      </div>
                  ))}
              </div>
            )}
        </div>
      </div>
    </section>
  );
}