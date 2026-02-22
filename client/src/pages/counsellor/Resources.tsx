import { useState, useEffect } from 'react';
import { apiConfig } from "@/lib/config";
import CounsellorSidebar from '@/components/CounsellorSidebar';
import { Upload, FileText, Video, Mic, CheckCircle, Clock, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function Resources() {
    const [resources, setResources] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'my-resources' | 'create'>('my-resources');
    const [formData, setFormData] = useState({ title: '', description: '', type: 'article', content: '', url: '', language: 'English' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
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
        setIsUploading(true);
        try {
            const token = localStorage.getItem('authToken');
            let finalUrl = formData.url;

            // Handle Cloudinary upload if file is selected
            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', selectedFile);

                const uploadRes = await fetch(`${apiConfig.baseUrl}/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: uploadFormData
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    finalUrl = uploadData.url;
                } else {
                    toast({ title: "Upload Failed", description: "Failed to upload media to Cloudinary.", variant: "destructive" });
                    setIsUploading(false);
                    return;
                }
            }

            const res = await fetch(`${apiConfig.baseUrl}/counsellor/resources`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, url: finalUrl })
            });

            if (res.ok) {
                toast({ title: "Success", description: "Resource submitted for review." });
                setFormData({ title: '', description: '', type: 'article', content: '', url: '', language: 'English' });
                setSelectedFile(null);
                fetchResources();
                setActiveTab('my-resources');
            }
        } catch (e) {
            toast({ title: "Error", description: "Failed to submit resource.", variant: "destructive" });
        } finally {
            setIsUploading(false);
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                <select
                                    value={formData.language}
                                    onChange={e => setFormData({ ...formData, language: e.target.value })}
                                    className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 bg-white"
                                >
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Marathi">Marathi</option>
                                    <option value="Bengali">Bengali</option>
                                    <option value="Tamil">Tamil</option>
                                    <option value="Telugu">Telugu</option>
                                    <option value="Kannada">Kannada</option>
                                    <option value="Malayalam">Malayalam</option>
                                </select>
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

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {formData.type === 'article' ? 'Header Image (Optional)' : 'Media File'}
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept={formData.type === 'video' ? 'video/*' : formData.type === 'audio' ? 'audio/*' : 'image/*'}
                                                onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <button type="button" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                                                <ImageIcon size={18} />
                                                {selectedFile ? 'Change File' : 'Upload File'}
                                            </button>
                                        </div>
                                        {selectedFile && (
                                            <span className="text-sm text-gray-600 truncate max-w-[200px]">{selectedFile.name}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {formData.type === 'article'
                                            ? 'Upload a cover image for your article.'
                                            : 'Upload your video or audio file directly.'}
                                    </p>
                                </div>

                                {formData.type !== 'article' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Direct URL (Alternative)</label>
                                        <input
                                            value={formData.url}
                                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                                            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                                            placeholder="https://..."
                                            disabled={!!selectedFile}
                                        />
                                    </div>
                                )}

                                {formData.type === 'article' && (
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
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={isUploading || !formData.title || !formData.description}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Processing...
                                        </>
                                    ) : (
                                        'Submit for Review'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
