import { useState, useEffect } from 'react';
import { apiConfig } from "@/lib/config";
import CounsellorSidebar from '@/components/CounsellorSidebar';
import { Upload, FileText, Video, Mic, CheckCircle, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function Resources() {
    const [resources, setResources] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'my-resources' | 'create'>('my-resources');
    const [formData, setFormData] = useState({ title: '', description: '', type: 'article', content: '', url: '' });
    const { toast } = useToast();

    useEffect(() => { fetchResources(); }, []);

    const fetchResources = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${apiConfig.baseUrl}/counsellor/resources`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setResources(await res.json());
        } catch (e) { }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${apiConfig.baseUrl}/counsellor/resources`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                toast({ title: "Success", description: "Resource submitted for review." });
                setFormData({ title: '', description: '', type: 'article', content: '', url: '' });
                fetchResources();
                setActiveTab('my-resources');
            }
        } catch (e) {
            toast({ title: "Error", description: "Failed to submit resource.", variant: "destructive" });
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <CounsellorSidebar />
            <div className="flex-1 overflow-y-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Resources</h1>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('my-resources')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'my-resources' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        My Contributions
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'create' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        + Create New
                    </button>
                </div>

                {activeTab === 'my-resources' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.map(r => (
                            <div key={r.id} className="bg-white p-6 rounded-xl shadow-md relative overflow-hidden">
                                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg ${r.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {r.status === 'approved' ? 'Live' : 'Pending Review'}
                                </div>
                                <div className="flex items-center gap-2 mb-4 text-gray-500">
                                    {r.type === 'video' && <Video size={20} />}
                                    {r.type === 'audio' && <Mic size={20} />}
                                    {r.type === 'article' && <FileText size={20} />}
                                    <span className="capitalize text-sm font-medium">{r.type}</span>
                                </div>
                                <h3 className="text-lg font-bold mb-2 line-clamp-2">{r.title}</h3>
                                <p className="text-xs text-gray-400">Submitted on {new Date(r.created_at).toLocaleDateString()}</p>
                            </div>
                        ))}
                        {resources.length === 0 && <p className="text-gray-500 col-span-3 text-center py-10">You haven't submitted any resources yet.</p>}
                    </div>
                ) : (
                    <div className="max-w-2xl bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-xl font-bold mb-6">Create New Resource</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                                <div className="flex gap-4">
                                    {['article', 'video', 'audio'].map(t => (
                                        <label key={t} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="type"
                                                value={t}
                                                checked={formData.type === t}
                                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="capitalize">{t}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500"
                                    placeholder="e.g. Coping with Anxiety"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 h-24"
                                    placeholder="Brief description of the content..."
                                />
                            </div>

                            {formData.type !== 'article' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Media URL</label>
                                    <input
                                        required
                                        value={formData.url}
                                        onChange={e => setFormData({ ...formData, url: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500"
                                        placeholder="https://..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Direct link to hosted video/audio file</p>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Article Content</label>
                                    <textarea
                                        required
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 h-64 font-mono text-sm"
                                        placeholder="# Write your article here (Markdown supported)..."
                                    />
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                                    Submit for Review
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
