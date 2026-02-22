import { useState, useEffect } from 'react';
import { apiConfig } from "@/lib/config";
import CounsellorSidebar from '@/components/CounsellorSidebar';
import { Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
    const [profile, setProfile] = useState<any>({
        username: '',
        specialization: '',
        availability: { days: [], timeRange: '09:00-17:00' }
    });
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const res = await fetch(`${apiConfig.baseUrl}/counsellor/settings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();

                    // Normalize availability
                    const availability = typeof data.availability === 'object' && data.availability?.days
                        ? data.availability
                        : { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], timeRange: "09:00-18:00" };

                    setProfile({ ...data, availability });
                }
            } catch (e) { } finally { setLoading(false); }
        };
        fetchSettings();
    }, []);

    const handleDayToggle = (day: string) => {
        setProfile((prev: any) => {
            const days = prev.availability.days.includes(day)
                ? prev.availability.days.filter((d: string) => d !== day)
                : [...prev.availability.days, day];
            return {
                ...prev,
                availability: { ...prev.availability, days }
            };
        });
    };

    const handleTimeChange = (type: 'start' | 'end', value: string) => {
        setProfile((prev: any) => {
            const [start, end] = prev.availability.timeRange.split("-");
            const newRange = type === 'start' ? `${value}-${end}` : `${start}-${value}`;
            return {
                ...prev,
                availability: { ...prev.availability, timeRange: newRange }
            };
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${apiConfig.baseUrl}/counsellor/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    specialization: profile.specialization,
                    availability: profile.availability,
                    meeting_location: profile.meeting_location
                })
            });
            if (res.ok) toast({ title: "Settings Saved", description: "Profile updated successfully." });
        } catch (e) { toast({ title: "Error", description: "Update failed.", variant: "destructive" }); }
    };

    const [startTime, endTime] = (profile.availability?.timeRange || "09:00-18:00").split("-");

    return (
        <div className="flex h-screen bg-gray-50">
            <CounsellorSidebar />
            <div className="flex-1 overflow-y-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Settings & Profile</h1>

                {loading ? <p>Loading...</p> : (
                    <div className="max-w-2xl bg-white p-8 rounded-xl shadow-md">
                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username (Read Only)</label>
                                <input
                                    disabled
                                    value={profile.username}
                                    className="w-full bg-gray-100 border rounded-lg px-4 py-2 text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                <input
                                    value={profile.specialization || ''}
                                    onChange={e => setProfile({ ...profile, specialization: e.target.value })}
                                    className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500"
                                    placeholder="e.g. CBT, Anxiety, Depression"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Physical Meeting Location</label>
                                <input
                                    value={profile.meeting_location || ''}
                                    onChange={e => setProfile({ ...profile, meeting_location: e.target.value })}
                                    className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500"
                                    placeholder="Enter full address for in-person consultations"
                                />
                                <p className="text-xs text-gray-500 mt-1">This will be shared with students who book personal meetings.</p>
                            </div>

                            {/* Graphical Availability Editor */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Availability Settings</h3>

                                <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {DAYS_OF_WEEK.map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => handleDayToggle(day)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm ${profile.availability.days.includes(day)
                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                        <input
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => handleTimeChange('start', e.target.value)}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                        <input
                                            type="time"
                                            value={endTime}
                                            onChange={(e) => handleTimeChange('end', e.target.value)}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                                    Define your working hours. The system will automatically generate 30-minute booking slots
                                    for students within this range on your selected days.
                                </p>
                            </div>

                            <div className="pt-6 border-t">
                                <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium shadow-md">
                                    <Save size={18} /> Save Settings
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
