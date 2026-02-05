import { useState, useEffect } from 'react';
import { apiConfig } from "@/lib/config";
import CounsellorSidebar from '@/components/CounsellorSidebar';
import { Search, User, ClipboardList, PlusCircle, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ClientBasic {
    id: number;
    name: string;
    email?: string;
    latest_note?: string;
}

interface ClientDetail {
    student: { id: number; name: string; email: string };
    notes: { id: number; content: string; timestamp: string }[];
    appointments: { id: number; date: string; status: string; mode: string }[];
}

export default function Clients() {
    const [clients, setClients] = useState<ClientBasic[]>([]);
    const [selectedClient, setSelectedClient] = useState<ClientDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [newNote, setNewNote] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${apiConfig.baseUrl}/counsellor/clients`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setClients(await res.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectClient = async (id: number) => {
        setLoadingDetails(true);
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${apiConfig.baseUrl}/counsellor/client/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setSelectedClient(await res.json());
            }
        } catch (e) { console.error(e); }
        finally { setLoadingDetails(false); }
    };

    const handeAddNote = async () => {
        if (!selectedClient || !newNote.trim()) return;
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${apiConfig.baseUrl}/counsellor/client/${selectedClient.student.id}/note`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ note: newNote })
            });

            if (res.ok) {
                toast({ title: "Note Added", description: "Private note saved successfully." });
                setNewNote("");
                handleSelectClient(selectedClient.student.id); // Refresh
            }
        } catch (e) {
            toast({ title: "Error", description: "Could not save note.", variant: "destructive" });
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <CounsellorSidebar />
            <div className="flex-1 flex overflow-hidden">
                {/* Client List (Sidebar within page) */}
                <div className="w-1/3 bg-white border-r flex flex-col">
                    <div className="p-4 border-b">
                        <h1 className="text-2xl font-bold mb-4">Clients</h1>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg outline-none focus:ring-2 ring-blue-500"
                                placeholder="Search clients..."
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loading ? <p className="p-4 text-center">Loading...</p> : clients.map(c => (
                            <div
                                key={c.id}
                                onClick={() => handleSelectClient(c.id)}
                                className={`p-4 border-b cursor-pointer hover:bg-blue-50 transition ${selectedClient?.student.id === c.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                            >
                                <div className="font-semibold text-gray-800">{c.name}</div>
                                {c.latest_note && <div className="text-xs text-gray-500 truncate mt-1">Note: {c.latest_note}</div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Client Details */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
                    {selectedClient ? (
                        <div className="max-w-3xl mx-auto space-y-6">
                            {/* Header */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                                        {selectedClient.student.name[0]}
                                    </div>
                                    {/* <div>
                                        <h2 className="text-2xl font-bold">{selectedClient.student.name}</h2>
                                        <p className="text-gray-500">{selectedClient.student.email}</p>
                                    </div> */}
                                </div>
                            </div>

                            {/* Private Notes Section */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <ClipboardList className="text-blue-600" /> Private Notes
                                </h3>

                                <div className="mb-4">
                                    <textarea
                                        value={newNote}
                                        onChange={e => setNewNote(e.target.value)}
                                        className="w-full border rounded-lg p-3 outline-none focus:ring-2 ring-blue-500 min-h-[100px]"
                                        placeholder="Add a confidential note about this client..."
                                    />
                                    <button
                                        onClick={handeAddNote}
                                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                                    >
                                        <Save size={16} /> Save Note
                                    </button>
                                </div>

                                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                                    {selectedClient.notes.map(n => (
                                        <div key={n.id} className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-sm">
                                            <p className="text-gray-800 mb-1">{n.content}</p>
                                            <p className="text-xs text-gray-400 text-right">{new Date(n.timestamp).toLocaleString()}</p>
                                        </div>
                                    ))}
                                    {selectedClient.notes.length === 0 && <p className="text-gray-400 italic">No notes added yet.</p>}
                                </div>
                            </div>

                            {/* Past Appointments */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">Recent History</h3>
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">Mode</th>
                                            <th className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedClient.appointments.map(a => (
                                            <tr key={a.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4">{new Date(a.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 capitalize">{a.mode.replace('_', ' ')}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {a.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <User size={64} className="mb-4 opacity-50" />
                            <p className="text-lg">Select a client to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
