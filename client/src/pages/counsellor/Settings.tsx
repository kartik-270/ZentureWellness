import { useState, useEffect } from 'react';
import { apiConfig } from "@/lib/config";
import CounsellorSidebar from '@/components/CounsellorSidebar';
import { Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
    const [profile, setProfile] = useState<any>({ username: '', specialization: '', availability: {} });
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const res = await fetch(`${apiConfig.baseUrl}/counsellor/settings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                }
            } catch (e) { } finally { setLoading(false); }
        };
        fetchSettings();
    }, []);

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
                    availability: profile.availability
                })
            });
            if (res.ok) toast({ title: "Settings Saved", description: "Profile updated successfully." });
        } catch (e) { toast({ title: "Error", description: "Update failed.", variant: "destructive" }); }
    };

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

                            {/* Simple Availability JSON Editor for now (Can be improved to UI later) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Availability (JSON Configuration)</label>
                                <textarea
                                    rows={5}
                                    value={JSON.stringify(profile.availability, null, 2)}
                                    onChange={e => {
                                        try {
                                            const json = JSON.parse(e.target.value);
                                            setProfile({ ...profile, availability: json });
                                        } catch (err) {
                                            // Just updating text, validation on save maybe?
                                            // Actually difficult to edit JSON directly. 
                                            // Let's just disable it or show a placeholder message for simplicity unless User explicitly asked for complex editor.
                                        }
                                    }}
                                    className="w-full border rounded-lg px-4 py-2 font-mono text-sm bg-gray-50 text-gray-500"
                                    readOnly
                                />
                                <p className="text-xs text-gray-500 mt-1">To update availability slots, please contact admin or use the graphical schedule tool (coming soon).</p>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
